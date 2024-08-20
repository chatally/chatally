import { getLogger, type Logger } from "@chatally/logger";
import QRCode from 'qrcode';
import { encode } from "querystring";
import defaultConfig from "../config/default.json";
import productionConfig from "../config/production.json";
import packageJson from "../package.json";
import { signalservice as Proto } from '../protos/compiled';
import type { KeyPairType } from './client/types';
import { encryptDeviceName, generateRegistrationId, getRandomBytes } from './crypto/Crypto';
import { generateKeyPair, generateKyberPreKey, generateSignedPreKey } from './crypto/Curve';
import { decryptProvisioning, type Provisioning } from './decryptProvisioning';
import { normalizeAci } from './ids/AciString';
import { isUntaggedPniString, normalizePni, toTaggedPni } from './ids/PniString';
import { ServiceIdKind, type ServiceIdString } from './ids/ServiceIdString';
import { Storage } from "./storage/Storage";
import { strictAssert } from './util/assert';
import { toBase64 } from './util/bytes';
import { promise } from './util/promise';
import { DAYS } from "./util/timeInMilliseconds";
import { WebSocketResource } from "./wsr/WebSocketResource";

const configFile = {
  ...packageJson,
  ...defaultConfig,
  ...productionConfig,
};

interface Config {
  log?: Logger;
  options?: Partial<Options>;
}

interface Options {
  userAgent: string;
  version: string;
  serverUrl: string;
  certificateAuthority: string;
  deviceName: string;
}

export class SignalApi {
  public readonly connected: Promise<this>;

  readonly #log: Logger;
  readonly #options: Options;
  readonly #storage: Storage;
  #socket: WebSocketResource | undefined;
  #reconnectTimeout: NodeJS.Timeout;

  constructor({ log, options = {} }: Config = {}) {
    this.#log = log || getLogger("SignalApi");
    this.#storage = new Storage({ log: this.#log.child("Storage") });
    this.#options = {
      userAgent: "OWD", //configFile.name,
      version: "7.17.0", //configFile.version,
      serverUrl: configFile.serverUrl,
      certificateAuthority: configFile.certificateAuthority,
      deviceName: "ChatAlly",
      ...options,
    };
    this.connected = new Promise((resolve, reject) => {
      this.#connect()
        .then(() => resolve(this))
        .catch((cause) => reject(
          new Error("Cannot connect to Signal server", { cause })
        ))
    });
  }

  async #connect() {
    clearTimeout(this.#reconnectTimeout);

    const { username, password } = this.#storage.user.getWebAPICredentials();
    if (username && password) {
      this.#socket = await this.#authenticate(username, password);
    } else {
      this.#log.info("No credentials found, registering...");
      this.#socket = await this.#register();
    }
    // Unset the socket and make sure, that we reconnect at least every 10 
    // days, so the Signal API is not unlinked from the account.
    this.#socket.on("close", () => {
      this.#socket = undefined;
      this.#reconnectTimeout = setTimeout(() => { this.#connect() }, 10 * DAYS);
    })
  }

  async #authenticate(login: string, password: string) {
    const { userAgent, version, serverUrl, certificateAuthority } =
      this.#options;
    const query = { agent: userAgent, version, login, password };
    const name = "authenticated";
    const url = `${serverUrl}/v1/websocket/?${encode(query)}`;
    const keepalive = "/v1/keepalive";
    return await WebSocketResource.connect({
      log: this.#log.child("WebSocket"),
      userAgent,
      name,
      url,
      keepalive,
      certificateAuthority,
      handleRequest: (request) => {
        this.#log.debug({ request });
        return undefined;
      }
    });
  }

  async #register(): Promise<WebSocketResource> {
    const { userAgent, version, serverUrl, certificateAuthority } = this.#options;
    const query = { agent: userAgent, version };
    const name = "provisioning";
    const url = `${serverUrl}/v1/websocket/provisioning/?${encode(query)}`;
    const keepalive = "/v1/keepalive/provisioning";
    const [uuidPromise, uuidResolve, uuidReject] = promise<string>();
    const [envelopePromise, envelopeResolve, envelopeReject] =
      promise<Proto.ProvisionEnvelope>();

    const { pubKey, privKey } = generateKeyPair();

    const socket = await WebSocketResource.connect({
      log: this.#log.child("Provisioning"),
      userAgent,
      name,
      url,
      keepalive,
      certificateAuthority,
      handleRequest: ({ verb, path, body }) => {
        this.#log.debug({ verb, path, body });
        if (path === '/v1/address' && verb === 'PUT' && body) {
          const proto = Proto.ProvisioningUuid.decode(body);
          const { uuid } = proto;
          if (uuid) {
            uuidResolve(uuid);
          } else {
            uuidReject(new Error("Provisioning: Expected a UUID"))
          }
        } else if (path === '/v1/message' && verb === 'PUT' && body) {
          const envelope = Proto.ProvisionEnvelope.decode(body);
          envelopeResolve(envelope);
          socket.close();
        } else {
          this.#log.error('Unknown provisioning message', { path, body });
        }
      }
    });
    socket.on("close", () => {
      const error = new Error("Unexpected close of Provisioning socket.")
      // This has no effect, if the promises are already resolved
      uuidReject(error);
      envelopeReject(error);
    });

    const uuid = await uuidPromise;
    const params = new URLSearchParams({ uuid, pub_key: toBase64(pubKey) });
    const provisioningUrl = new URL(`sgnl://linkdevice?${params.toString()}`);
    const qrCode = await QRCode.toString(provisioningUrl.toString());
    this.#log.info(
      `Open the following URL with your primary Signal device
  ${provisioningUrl}
alternatively, scan this QR code
  ${qrCode}`
    );

    const envelope = await envelopePromise;
    const provisioning = decryptProvisioning(envelope, privKey);
    const { login, password } = await this.#createAccount(provisioning);

    return this.#authenticate(login, password);
  }

  async #createAccount(registration: Provisioning) {
    validate(registration, "number");
    validate(registration, "provisioningCode");
    validate(registration, "aciKeyPair");
    validate(registration, "pniKeyPair");
    validate(registration, "aci");
    validate(registration, "profileKey", isNotEmpty);
    validate(registration, "masterKey", isNotEmpty);
    validate(registration, "untaggedPni", isUntaggedPniString)

    const ourAci = normalizeAci(
      registration.aci,
      'provisioning.aci',
      this.#log
    );
    const ourPni = normalizePni(
      toTaggedPni(registration.untaggedPni),
      'provisioning.pni',
      this.#log
    );

    const { deviceName } = this.#options;
    const storage = this.#storage;
    const log = this.#log;

    const {
      number,
      provisioningCode,
      aciKeyPair,
      pniKeyPair,
      profileKey,
      masterKey,
      readReceipts,
      userAgent,
    } = registration;

    const password = toBase64(getRandomBytes(16)).slice(0, -2);
    const registrationId = generateRegistrationId();
    const pniRegistrationId = generateRegistrationId();

    // storage.protocol.clear();
    // await senderCertificateService.clear();

    const aciPqLastResortPreKey = this.generateLastResortKyberKey(
      ServiceIdKind.ACI, aciKeyPair
    );
    const pniPqLastResortPreKey = this.generateLastResortKyberKey(
      ServiceIdKind.PNI, pniKeyPair
    );
    const aciSignedPreKey = await this.generateSignedPreKey(
      ServiceIdKind.ACI, aciKeyPair
    );
    const pniSignedPreKey = await this.generateSignedPreKey(
      ServiceIdKind.PNI, pniKeyPair
    );

    const keysToUpload = {
      aciSignedPreKey: {
        keyId: aciSignedPreKey.keyId,
        publicKey: aciSignedPreKey.keyPair.pubKey,
        signature: aciSignedPreKey.signature,
      },
      pniSignedPreKey: {
        keyId: pniSignedPreKey.keyId,
        publicKey: pniSignedPreKey.keyPair.pubKey,
        signature: pniSignedPreKey.signature,
      },
      aciPqLastResortPreKey: {
        keyId: aciPqLastResortPreKey.id(),
        publicKey: aciPqLastResortPreKey.publicKey().serialize(),
        signature: aciPqLastResortPreKey.signature(),
      },
      pniPqLastResortPreKey: {
        keyId: pniPqLastResortPreKey.id(),
        publicKey: pniPqLastResortPreKey.publicKey().serialize(),
        signature: pniPqLastResortPreKey.signature(),
      },
    };

    const encryptedDeviceName = encryptDeviceName(
      deviceName, aciKeyPair.pubKey
    );
    const response = await this.linkDevice({
      number,
      provisioningCode,
      encryptedDeviceName,
      newPassword: password,
      registrationId,
      pniRegistrationId,
      ...keysToUpload,
    });

    const deviceId = response.deviceId ?? 1;
    strictAssert(
      ourAci === normalizeAci(response.uuid, 'createAccount'),
      'Response has unexpected ACI'
    );
    strictAssert(
      isUntaggedPniString(response.pni),
      'Response pni must be untagged'
    );
    strictAssert(
      ourPni === toTaggedPni(response.pni),
      'Response has unexpected PNI'
    );

    // `setCredentials` needs to be called
    // before `saveIdentifyWithAttributes` since `saveIdentityWithAttributes`
    // indirectly calls `ConversationController.getConversationId()` which
    // initializes the conversation for the given number (our number) which
    // calls out to the user storage API to get the stored UUID and number
    // information.
    await storage.user.setCredentials({
      aci: ourAci,
      pni: ourPni,
      number,
      deviceId,
      deviceName,
      password,
    });

    // This needs to be done very early, because it changes how things are saved in the
    //   database. Your identity, for example, in the saveIdentityWithAttributes call
    //   below.
    window.ConversationController.maybeMergeContacts({
      aci: ourAci,
      pni: ourPni,
      e164: number,
      reason: 'createAccount',
    });

    const identityAttrs = {
      firstUse: true,
      timestamp: Date.now(),
      verified: storage.protocol.VerifiedStatus.VERIFIED,
      nonblockingApproval: true,
    };

    // update our own identity key, which may have changed
    // if we're relinking after a reinstall on the master device
    await Promise.all([
      storage.protocol.saveIdentityWithAttributes(ourAci, {
        ...identityAttrs,
        publicKey: aciKeyPair.pubKey,
      }),
      storage.protocol.saveIdentityWithAttributes(ourPni, {
        ...identityAttrs,
        publicKey: pniKeyPair.pubKey,
      }),
    ]);

    const identityKeyMap = {
      ...(storage.get('identityKeyMap') || {}),
      [ourAci]: aciKeyPair,
      [ourPni]: pniKeyPair,
    };
    const registrationIdMap = {
      ...(storage.get('registrationIdMap') || {}),
      [ourAci]: registrationId,
      [ourPni]: pniRegistrationId,
    };

    storage.put('identityKeyMap', identityKeyMap);
    storage.put('registrationIdMap', registrationIdMap);
    ourProfileKeyService.set(profileKey);
    if (userAgent) {
      storage.put('userAgent', userAgent);
    }
    storage.put('masterKey', Bytes.toBase64(masterKey));
    storage.put(
      'storageKey',
      Bytes.toBase64(deriveStorageServiceKey(masterKey))
    );

    storage.put('read-receipt-setting', Boolean(readReceipts));

    const regionCode = getRegionCodeForNumber(number);
    storage.put('regionCode', regionCode);
    storage.protocol.hydrateCaches();

    const protocol = storage.protocol;
    await protocol.storeSignedPreKey(
      ourAci,
      aciSignedPreKey.keyId,
      aciSignedPreKey.keyPair
    );
    await protocol.storeSignedPreKey(
      ourPni,
      pniSignedPreKey.keyId,
      pniSignedPreKey.keyPair
    );
    await protocol.storeKyberPreKeys(ourAci, [
      kyberPreKeyToStoredSignedPreKey(aciPqLastResortPreKey, ourAci),
    ]);
    await protocol.storeKyberPreKeys(ourPni, [
      kyberPreKeyToStoredSignedPreKey(pniPqLastResortPreKey, ourPni),
    ]);

    await this._confirmKeys(
      {
        pqLastResortPreKey: keysToUpload.aciPqLastResortPreKey,
        signedPreKey: keysToUpload.aciSignedPreKey,
      },
      ServiceIdKind.ACI
    );
    await this._confirmKeys(
      {
        pqLastResortPreKey: keysToUpload.pniPqLastResortPreKey,
        signedPreKey: keysToUpload.pniSignedPreKey,
      },
      ServiceIdKind.PNI
    );

    const uploadKeys = async (kind: ServiceIdKind) => {
      try {
        const keys = await this._generateSingleUseKeys(kind);
        await this.server.registerKeys(keys, kind);
      } catch (error) {
        if (kind === ServiceIdKind.PNI) {
          log.error(
            'Failed to upload PNI prekeys. Moving on',
            error
          );
          return;
        }
        throw error;
      }
    };

    await Promise.all([
      uploadKeys(ServiceIdKind.ACI),
      uploadKeys(ServiceIdKind.PNI),
    ]);
    return { login: ourAci, password };
  }

  private generateLastResortKyberKey(
    kind: ServiceIdKind,
    identityKey: KeyPairType
  ) {
    const aciKey = 'maxKyberPreKeyId';
    const pniKey = 'maxKyberPreKeyIdPNI';
    const key = kind === ServiceIdKind.PNI ? pniKey : aciKey;

    let id = this.#storage.get(key);
    if (typeof id !== "number") {
      if (kind === ServiceIdKind.PNI) {
        id = this.#storage.get(aciKey, 1);
      } else {
        id = 1;
      }
    }
    const record = generateKyberPreKey(identityKey, id);
    this.#log.info(`Saving new last resort prekey`, id);
    this.#storage.put(key, id + 1);

    return record;
  }

  private async generateSignedPreKey(
    kind: ServiceIdKind,
    identityKey: KeyPairType
  ) {
    const aciKey = 'signedKeyId';
    const pniKey = 'signedKeyIdPNI';
    const key = kind === ServiceIdKind.PNI ? pniKey : aciKey;

    let id = this.#storage.get(key);
    if (typeof id !== "number") {
      if (kind === ServiceIdKind.PNI) {
        id = this.#storage.get(aciKey, 1);
      } else {
        id = 1;
      }
    }

    const signed = generateSignedPreKey(identityKey, id);
    this.#log.info(`Saving new signed prekey`, signed.keyId);
    this.#storage.put(key, id + 1);

    return signed;
  }

  encryptDeviceName(
    name: string,
    identityKey: KeyPairType
  ): string | undefined {
    if (!name) {
      return undefined;
    }
    const encrypted = encryptDeviceName(name, identityKey.pubKey);

    const proto = new Proto.DeviceName();
    proto.ephemeralPublic = encrypted.ephemeralPublic;
    proto.syntheticIv = encrypted.syntheticIv;
    proto.ciphertext = encrypted.ciphertext;

    const bytes = Proto.DeviceName.encode(proto).finish();
    return toBase64(bytes);
  }

  async send(to: ServiceIdString, message: string) {
  }
}

function validate(obj: any, property: string, predicate: (value: any) => boolean = (v) => !!v) {
  const value = obj[property];
  if (!predicate(value)) {
    throw new Error(`Invalid property ${property} (${value})`);
  }
}

function isNotEmpty(data: Uint8Array | undefined | null) {
  return !!data && data.length > 0;
}
