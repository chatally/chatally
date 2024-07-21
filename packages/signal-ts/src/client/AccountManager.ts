import { noLogger, type Logger } from '@chatally/logger';
import { generateKeyPair } from './Curve';
import { ServiceIdKind } from './ServiceId';
import type { SignalServer } from './SignalServer';
import type { Storage } from './Storage';
import { signalservice as Proto } from './protos/compiled';
import type { KeyPairType, UploadPreKeyType } from './types';
import { toLogFormat } from './util/errors';
import { explodePromise } from './util/promise';

interface Config {
  log?: Logger;
  storage: Storage;
  server: SignalServer;
}

export class AccountManager {
  log: Logger;
  storage: Storage;
  server: SignalServer;

  constructor({ log, storage, server }: Config) {
    this.log = log || noLogger;
    this.storage = storage;
    this.server = server;
  }

  async register(resolve: () => void, reject: (e: Error) => void) {
    try {
      const { pubKey, privKey } = generateKeyPair();
      const {
        promise: envelopePromise,
        resolve: resolveEnvelope,
        reject: rejectEnvelope
      } = explodePromise<Proto.ProvisionEnvelope>();
      const socket = await this.server.getProvisioningResource({
        handleRequest(request: IncomingWebSocketRequest) {
          if (
            request.path === '/v1/address' &&
            request.verb === 'PUT' &&
            request.body
          ) {
            const proto = Proto.ProvisioningUuid.decode(request.body);
            const { uuid } = proto;
            if (!uuid) {
              throw new Error('registerSecondDevice: expected a UUID');
            }
            const url = linkDeviceRoute
              .toAppUrl({ uuid, pubKey: Buffer.from(pubKey).toString('base64') })
              .toString();
            // window.SignalCI?.setProvisioningURL(url);
            setProvisioningUrl(url);
            request.respond(200, 'OK');
          } else if (
            request.path === '/v1/message' &&
            request.verb === 'PUT' &&
            request.body
          ) {
            const envelope = Proto.ProvisionEnvelope.decode(request.body);
            request.respond(200, 'OK');
            socket.close();
            resolveEnvelope(envelope);
          } else {
            this.log.error('Unknown websocket message', request.path);
          }
        },
      });

      this.log.info('provisioning socket open');
      socket.addEventListener('close', ({ code, reason }) => {
        this.log.info(
          `Provisioning socket closed. Code: ${code} Reason: ${reason}`
        );
        // Note: if the envelope is resolved already this has no effect
        rejectEnvelope(new Error('websocket closed'));
      });

      const envelope = await envelopePromise;
      const provisionMessage = await provisioningCipher.decrypt(envelope);

      await this.queueTask(async () => {
        const { deviceName, backupFile } = await confirmNumber(
          provisionMessage.number
        );
        if (typeof deviceName !== 'string' || deviceName.length === 0) {
          throw new Error(
            'AccountManager.registerSecondDevice: Invalid device name'
          );
        }
        if (
          !provisionMessage.number ||
          !provisionMessage.provisioningCode ||
          !provisionMessage.aciKeyPair ||
          !provisionMessage.pniKeyPair ||
          !provisionMessage.aci ||
          !Bytes.isNotEmpty(provisionMessage.profileKey) ||
          !Bytes.isNotEmpty(provisionMessage.masterKey) ||
          !isUntaggedPniString(provisionMessage.untaggedPni)
        ) {
          throw new Error(
            'AccountManager.registerSecondDevice: Provision message was missing key data'
          );
        }

        const ourAci = normalizeAci(provisionMessage.aci, 'provisionMessage.aci');
        const ourPni = normalizePni(
          toTaggedPni(provisionMessage.untaggedPni),
          'provisionMessage.pni'
        );

        const registrationBaton = this.server.startRegistration();
        try {
          await this.createAccount({
            type: AccountType.Linked,
            number: provisionMessage.number,
            verificationCode: provisionMessage.provisioningCode,
            aciKeyPair: provisionMessage.aciKeyPair,
            pniKeyPair: provisionMessage.pniKeyPair,
            profileKey: provisionMessage.profileKey,
            deviceName,
            backupFile,
            userAgent: provisionMessage.userAgent,
            ourAci,
            ourPni,
            readReceipts: Boolean(provisionMessage.readReceipts),
            masterKey: provisionMessage.masterKey,
          });
        } finally {
          this.server.finishRegistration(registrationBaton);
        }

        await this.registrationDone();
      });

      await new Promise((res, _rej) => setTimeout(res, 2000));
      resolve();
    } catch (e) {
      this.log.error("Registration failed", e);
      reject(e);
    }
  }

  async maybeUpdateKeys(
    serviceIdKind: ServiceIdKind,
    forceUpdate = false
  ): Promise<void> {
    const logId = `maybeUpdateKeys(${serviceIdKind})`;
    let identityKey: KeyPairType;

    try {
      const ourServiceId = this.storage.user.getCheckedServiceId(serviceIdKind);
      identityKey = this.getIdentityKeyOrThrow(ourServiceId);
    } catch (error) {
      if (serviceIdKind === ServiceIdKind.PNI) {
        this.log.info(
          `${logId}: Not enough information to update PNI keys`,
          toLogFormat(error)
        );
        return;
      }

      throw error;
    }

    const { count: preKeyCount, pqCount: kyberPreKeyCount } =
      await this.server.getMyKeyCounts(serviceIdKind);

    let preKeys: Array<UploadPreKeyType> | undefined;

    // We want to generate new keys both if there are too few keys, and also if we
    // have too many on the server (unlikely, but has happened due to bugs), since
    // uploading new keys _should_ replace all existing ones on the server
    if (
      preKeyCount < PRE_KEY_MINIMUM ||
      preKeyCount > PRE_KEY_MAX_COUNT ||
      forceUpdate
    ) {
      this.log.info(
        `${logId}: Server prekey count is ${preKeyCount}, generating a new set`
      );
      preKeys = await this.generateNewPreKeys(serviceIdKind);
    }

    let pqPreKeys: Array<UploadKyberPreKeyType> | undefined;
    if (
      kyberPreKeyCount < PRE_KEY_MINIMUM ||
      preKeyCount > PRE_KEY_MAX_COUNT ||
      forceUpdate
    ) {
      this.log.info(
        `${logId}: Server kyber prekey count is ${kyberPreKeyCount}, generating a new set`
      );
      pqPreKeys = await this.generateNewKyberPreKeys(serviceIdKind);
    }

    const pqLastResortPreKey = await this.maybeUpdateLastResortKyberKey(
      serviceIdKind,
      forceUpdate
    );
    const signedPreKey = await this.maybeUpdateSignedPreKey(
      serviceIdKind,
      forceUpdate
    );

    if (
      !preKeys?.length &&
      !signedPreKey &&
      !pqLastResortPreKey &&
      !pqPreKeys?.length
    ) {
      this.log.info(`${logId}: No new keys are needed; returning early`);
      return;
    }

    const keySummary: Array<string> = [];
    if (preKeys?.length) {
      keySummary.push(`${preKeys.length} prekeys`);
    }
    if (signedPreKey) {
      keySummary.push('a signed prekey');
    }
    if (pqLastResortPreKey) {
      keySummary.push('a last-resort kyber prekey');
    }
    if (pqPreKeys?.length) {
      keySummary.push(`${pqPreKeys.length} kyber prekeys`);
    }
    this.log.info(`${logId}: Uploading with ${keySummary.join(', ')}`);

    const toUpload = {
      identityKey: identityKey.pubKey,
      preKeys,
      pqPreKeys,
      pqLastResortPreKey,
      signedPreKey,
    };

    await this.server.registerKeys(toUpload, serviceIdKind);
    await this._confirmKeys(toUpload, serviceIdKind);

    const { count: updatedPreKeyCount, pqCount: updatedKyberPreKeyCount } =
      await this.server.getMyKeyCounts(serviceIdKind);
    this.log.info(
      `${logId}: Successfully updated; ` +
      `server prekey count: ${updatedPreKeyCount}, ` +
      `server kyber prekey count: ${updatedKyberPreKeyCount}`
    );

    await this._cleanSignedPreKeys(serviceIdKind);
    await this._cleanLastResortKeys(serviceIdKind);
    await this._cleanPreKeys(serviceIdKind);
    await this._cleanKyberPreKeys(serviceIdKind);
  }

  areKeysOutOfDate(serviceIdKind: ServiceIdKind): boolean {
    const signedPreKeyTime = this.storage.get(
      SIGNED_PRE_KEY_UPDATE_TIME_KEY[serviceIdKind],
      0
    );
    const lastResortKeyTime = this.storage.get(
      LAST_RESORT_KEY_UPDATE_TIME_KEY[serviceIdKind],
      0
    );

    if (isOlderThan(signedPreKeyTime, KEY_TOO_OLD_THRESHOLD)) {
      return true;
    }
    if (isOlderThan(lastResortKeyTime, KEY_TOO_OLD_THRESHOLD)) {
      return true;
    }

    return false;
  }

}