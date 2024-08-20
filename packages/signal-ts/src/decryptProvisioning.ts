import { signalservice as Proto } from '../protos/compiled';
import type { KeyPairType } from './client/types';
import {
  decryptAes256CbcPkcsPadding,
  deriveSecrets,
  verifyHmacSha256,
} from './crypto/Crypto';
import { calculateAgreement, createKeyPair } from './crypto/Curve';
import { strictAssert } from './util/assert';
import { dropNull } from './util/dropNull';

export type Provisioning = {
  aciKeyPair: KeyPairType;
  pniKeyPair?: KeyPairType;
  number?: string;
  aci?: string;
  untaggedPni?: string;
  provisioningCode?: string;
  userAgent?: string;
  readReceipts?: boolean;
  profileKey?: Uint8Array;
  masterKey?: Uint8Array;
};

export function decryptProvisioning(
  { publicKey, body }: Proto.ProvisionEnvelope, privKey: Uint8Array
): Provisioning {

  strictAssert(publicKey, 'Missing publicKey in ProvisionEnvelope');
  strictAssert(body, 'Missing body in ProvisionEnvelope');
  strictAssert(
    new Uint8Array(body)[0] === 1,
    'Bad version number on ProvisioningMessage'
  );

  const iv = body.slice(1, 16 + 1);
  const mac = body.slice(body.byteLength - 32, body.byteLength);
  const ivAndCiphertext = body.slice(0, body.byteLength - 32);
  const ciphertext = body.slice(16 + 1, body.byteLength - 32);

  const ecRes = calculateAgreement(publicKey, privKey);
  const keys = deriveSecrets(
    ecRes,
    new Uint8Array(32),
    Buffer.from('TextSecure Provisioning Message')
  );
  verifyHmacSha256(ivAndCiphertext, keys[1], mac, 32);

  const decrypted = decryptAes256CbcPkcsPadding(keys[0], ciphertext, iv);
  const decoded = Proto.ProvisionMessage.decode(decrypted);
  const pniPrivKey = decoded.pniIdentityKeyPrivate;
  const aciPrivKey = decoded.aciIdentityKeyPrivate;
  strictAssert(aciPrivKey, 'Missing aciIdentityKeyPrivate in ProvisionMessage');

  const aciKeyPair = createKeyPair(aciPrivKey);
  const pniKeyPair = pniPrivKey?.length
    ? createKeyPair(pniPrivKey)
    : undefined;

  const { aci, pni } = decoded;
  strictAssert(aci, 'Missing aci in provisioning message');
  strictAssert(pni, 'Missing pni in provisioning message');

  const result: Provisioning = {
    aciKeyPair,
    pniKeyPair,
    number: dropNull(decoded.number),
    aci,
    untaggedPni: pni,
    provisioningCode: dropNull(decoded.provisioningCode),
    userAgent: dropNull(decoded.userAgent),
    readReceipts: decoded.readReceipts ?? false,
  };
  if (!isEmpty(decoded.profileKey)) {
    result.profileKey = decoded.profileKey;
  }
  if (!isEmpty(decoded.masterKey)) {
    result.masterKey = decoded.masterKey;
  }
  return result;
}

function isEmpty(data: Uint8Array | null | undefined) {
  return !data || data.length === 0;
}
