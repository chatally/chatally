// Copyright 2020 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Agent } from 'https';
import { escapeRegExp, isNumber, isObject, isString } from 'lodash';
// import type { RequestInit, Response } from 'node-fetch';
// import fetch from 'node-fetch';
import PQueue from 'p-queue';
import type { Readable } from 'stream';
import { v4 as getGuid } from 'uuid';
import { z } from 'zod';

import { Net } from '@signalapp/libsignal-client';
import { randomInt } from '../crypto/Crypto';
import { fromBase64, toBase64 } from './util/bytes';
// import { isBadgeImageFileUrlValid } from '../badges/isBadgeImageFileUrlValid';
// import * as linkPreviewFetch from '../linkPreviews/linkPreviewFetch';
// import type { DirectoryConfigType } from '../types/RendererConfig';
import type {
  AciString,
  ServiceIdString,
  UntaggedPniString,
} from '../ids/ServiceIdString';
import {
  ServiceIdKind,
  aciSchema,
  serviceIdSchema,
  untaggedPniSchema,
} from '../types/ServiceId';
import type { SocketStatus } from '../types/SocketStatus';
import { isPackIdValid, redactPackId } from '../types/Stickers';
import { VerificationTransport } from '../types/VerificationTransport';
import type { BackupPresentationHeadersType } from '../types/backups';
import { toLogFormat } from '../types/errors';
import { strictAssert } from '../util/assert';
import { createHTTPSAgent } from '../util/createHTTPSAgent';
import type { ProxyAgent } from '../util/createProxyAgent';
import { createProxyAgent } from '../util/createProxyAgent';
import * as durations from '../util/durations';
import type { ExplodePromiseResultType } from '../util/explodePromise';
import { explodePromise } from '../util/explodePromise';
import { getTimeoutStream } from '../util/getStreamWithTimeout';
import { getUserAgent } from '../util/getUserAgent';
import { isRecord } from '../util/isRecord';
import type { FetchFunctionType } from '../util/uploads/tusProtocol';
import { formatAcceptLanguageHeader } from '../util/userLanguages';
import { fromWebSafeBase64, toWebSafeBase64 } from '../util/webSafeBase64';

import { SignalService as Proto } from '../protobuf';
import { SocketManager } from './SocketManager';
import { CDSI } from './cds/CDSI';
import type { CDSAuthType, CDSResponseType } from './cds/Types.d';

import { Environment, getEnvironment } from '../environment';
import * as log from '../logging/log';
import { SECOND } from '../util/durations';
import { maybeParseUrl, urlPathFromComponents } from '../util/url';
import { HTTPError } from './Errors';
import type MessageSender from './SendMessage';
import type {
  IRequestHandler,
  StorageServiceCallOptionsType,
  StorageServiceCredentials,
  WebAPICredentials,
} from './Types.d';
import { translateError } from './Utils';
import type { IWebSocketResource } from './WebsocketResources';

// Note: this will break some code that expects to be able to use err.response when a
//   web request fails, because it will force it to text. But it is very useful for
//   debugging failed requests.
const DEBUG = false;
const DEFAULT_TIMEOUT = 30 * SECOND;

// Libsignal has internally configured values for domain names
// (and other connectivity params) of the services.
function resolveLibsignalNetEnvironment(
  appEnv: Environment,
  url: string
): Net.Environment {
  switch (appEnv) {
    case Environment.Production:
      return Net.Environment.Production;
    case Environment.Development:
      // In the case of the `Development` Desktop env,
      // we should be checking the provided string value
      // of `libsignalNetEnv`
      if (/staging/i.test(url)) {
        return Net.Environment.Staging;
      }
      return Net.Environment.Production;
    case Environment.Test:
    case Environment.Staging:
    default:
      return Net.Environment.Staging;
  }
}

function _createRedactor(
  ...toReplace: ReadonlyArray<string | undefined>
): RedactUrl {
  // NOTE: It would be nice to remove this cast, but TypeScript doesn't support
  //   it. However, there is [an issue][0] that discusses this in more detail.
  // [0]: https://github.com/Microsoft/TypeScript/issues/16069
  const stringsToReplace = toReplace.filter(Boolean) as Array<string>;
  return href =>
    stringsToReplace.reduce((result: string, stringToReplace: string) => {
      const pattern = RegExp(escapeRegExp(stringToReplace), 'g');
      const replacement = `[REDACTED]${stringToReplace.slice(-3)}`;
      return result.replace(pattern, replacement);
    }, href);
}

function _validateResponse(response: any, schema: any) {
  try {
    for (const i in schema) {
      switch (schema[i]) {
        case 'object':
        case 'string':
        case 'number':
          // eslint-disable-next-line valid-typeof
          if (typeof response[i] !== schema[i]) {
            return false;
          }
          break;
        default:
      }
    }
  } catch (ex) {
    return false;
  }

  return true;
}

const FIVE_MINUTES = 5 * durations.MINUTE;
const GET_ATTACHMENT_CHUNK_TIMEOUT = 10 * durations.SECOND;

type AgentCacheType = {
  [name: string]: {
    timestamp: number;
    agent: ProxyAgent | Agent;
  };
};
const agents: AgentCacheType = {};

function getContentType(response: Response) {
  if (response.headers && response.headers.get) {
    return response.headers.get('content-type');
  }

  return null;
}

type FetchHeaderListType = { [name: string]: string };
export type HeaderListType = { [name: string]: string | ReadonlyArray<string> };

type RedactUrl = (url: string) => string;

type JSONWithDetailsType<Data = unknown> = {
  data: Data;
  contentType: string | null;
  response: Response;
};
type BytesWithDetailsType = {
  data: Uint8Array;
  contentType: string | null;
  response: Response;
};

export const multiRecipient200ResponseSchema = z.object({
  uuids404: z.array(serviceIdSchema).optional(),
  needsSync: z.boolean().optional(),
});
export type MultiRecipient200ResponseType = z.infer<
  typeof multiRecipient200ResponseSchema
>;

export const multiRecipient409ResponseSchema = z.array(
  z.object({
    uuid: serviceIdSchema,
    devices: z.object({
      missingDevices: z.array(z.number()).optional(),
      extraDevices: z.array(z.number()).optional(),
    }),
  })
);
export type MultiRecipient409ResponseType = z.infer<
  typeof multiRecipient409ResponseSchema
>;

export const multiRecipient410ResponseSchema = z.array(
  z.object({
    uuid: serviceIdSchema,
    devices: z.object({
      staleDevices: z.array(z.number()).optional(),
    }),
  })
);
export type MultiRecipient410ResponseType = z.infer<
  typeof multiRecipient410ResponseSchema
>;

function isSuccess(status: number): boolean {
  return status >= 0 && status < 400;
}

function getHostname(url: string): string {
  const urlObject = new URL(url);
  return urlObject.hostname;
}

function makeHTTPError(
  message: string,
  providedCode: number,
  headers: HeaderListType,
  response: unknown,
  stack?: string
) {
  return new HTTPError(message, {
    code: providedCode,
    headers,
    response,
    stack,
  });
}

const URL_CALLS = {
  accountExistence: 'v1/accounts/account',
  attachmentUploadForm: 'v4/attachments/form/upload',
  attestation: 'v1/attestation',
  batchIdentityCheck: 'v1/profile/identity_check/batch',
  challenge: 'v1/challenge',
  config: 'v1/config',
  deliveryCert: 'v1/certificate/delivery',
  directoryAuthV2: 'v2/directory/auth',
  discovery: 'v1/discovery',
  getGroupAvatarUpload: 'v1/groups/avatar/form',
  getGroupCredentials: 'v1/certificate/auth/group',
  getIceServers: 'v1/calling/relays',
  getOnboardingStoryManifest:
    'dynamic/desktop/stories/onboarding/manifest.json',
  getStickerPackUpload: 'v1/sticker/pack/form',
  getBackupCredentials: 'v1/archives/auth',
  getBackupCDNCredentials: 'v1/archives/auth/read',
  getBackupUploadForm: 'v1/archives/upload/form',
  getBackupMediaUploadForm: 'v1/archives/media/upload/form',
  groupLog: 'v2/groups/logs',
  groupJoinedAtVersion: 'v1/groups/joined_at_version',
  groups: 'v2/groups',
  groupsViaLink: 'v1/groups/join/',
  groupToken: 'v1/groups/token',
  keys: 'v2/keys',
  linkDevice: 'v1/devices/link',
  messages: 'v1/messages',
  multiRecipient: 'v1/messages/multi_recipient',
  phoneNumberDiscoverability: 'v2/accounts/phone_number_discoverability',
  profile: 'v1/profile',
  backup: 'v1/archives',
  backupMedia: 'v1/archives/media',
  backupMediaBatch: 'v1/archives/media/batch',
  backupMediaDelete: 'v1/archives/media/delete',
  callLinkCreateAuth: 'v1/call-link/create-auth',
  registration: 'v1/registration',
  registerCapabilities: 'v1/devices/capabilities',
  reportMessage: 'v1/messages/report',
  setBackupId: 'v1/archives/backupid',
  setBackupSignatureKey: 'v1/archives/keys',
  signed: 'v2/keys/signed',
  storageManifest: 'v1/storage/manifest',
  storageModify: 'v1/storage/',
  storageRead: 'v1/storage/read',
  storageToken: 'v1/storage/auth',
  subscriptions: 'v1/subscription',
  subscriptionConfiguration: 'v1/subscription/configuration',
  supportUnauthenticatedDelivery: 'v1/devices/unauthenticated_delivery',
  updateDeviceName: 'v1/accounts/name',
  username: 'v1/accounts/username_hash',
  reserveUsername: 'v1/accounts/username_hash/reserve',
  confirmUsername: 'v1/accounts/username_hash/confirm',
  usernameLink: 'v1/accounts/username_link',
  verificationSession: 'v1/verification/session',
  whoami: 'v1/accounts/whoami',
};

const WEBSOCKET_CALLS = new Set<keyof typeof URL_CALLS>([
  // MessageController
  'messages',
  'multiRecipient',
  'reportMessage',

  // ProfileController
  'profile',

  // AttachmentControllerV3
  'attachmentUploadForm',

  // RemoteConfigController
  'config',

  // Certificate
  'deliveryCert',
  'getGroupCredentials',

  // Devices
  'linkDevice',
  'registerCapabilities',
  'supportUnauthenticatedDelivery',

  // Directory
  'directoryAuthV2',

  // Storage
  'storageToken',

  // Account V2
  'phoneNumberDiscoverability',

  // Backups
  'getBackupCredentials',
  'getBackupCDNCredentials',
  'getBackupMediaUploadForm',
  'getBackupUploadForm',
  'backup',
  'backupMedia',
  'backupMediaBatch',
  'backupMediaDelete',
  'setBackupId',
  'setBackupSignatureKey',
]);

type InitializeOptionsType = {
  url: string;
  storageUrl: string;
  updatesUrl: string;
  resourcesUrl: string;
  cdnUrlObject: {
    readonly '0': string;
    readonly [propName: string]: string;
  };
  certificateAuthority: string;
  contentProxyUrl: string;
  proxyUrl: string | undefined;
  version: string;
  directoryConfig: DirectoryConfigType;
  disableIPv6: boolean;
};

export type MessageType = Readonly<{
  type: number;
  destinationDeviceId: number;
  destinationRegistrationId: number;
  content: string;
}>;

export type WebAPIConnectOptionsType = WebAPICredentials & {
  useWebSocket?: boolean;
  hasStoriesDisabled: boolean;
};

export type WebAPIConnectType = {
  connect: (options: WebAPIConnectOptionsType) => WebAPIType;
};

export type CapabilitiesType = {
  deleteSync: boolean;
};
export type CapabilitiesUploadType = {
  deleteSync: true;
};

type StickerPackManifestType = Uint8Array;

export type GroupCredentialType = {
  credential: string;
  redemptionTime: number;
};
export type GroupCredentialsType = {
  groupPublicParamsHex: string;
  authCredentialPresentationHex: string;
};
export type CallLinkAuthCredentialsType = {
  callLinkPublicParamsHex: string;
  authCredentialPresentationHex: string;
};
export type GetGroupLogOptionsType = Readonly<{
  startVersion: number | undefined;
  includeFirstState: boolean;
  includeLastState: boolean;
  maxSupportedChangeEpoch: number;
  cachedEndorsementsExpiration: number | null; // seconds
}>;
export type GroupLogResponseType = {
  changes: Proto.GroupChanges;
  groupSendEndorsementResponse: Uint8Array | null;
} & (
    | {
      paginated: false;
    }
    | {
      paginated: true;
      currentRevision: number;
      start: number;
      end: number;
    }
  );

export type ProfileRequestDataType = {
  about: string | null;
  aboutEmoji: string | null;
  avatar: boolean;
  sameAvatar: boolean;
  commitment: string;
  name: string;
  paymentAddress: string | null;
  phoneNumberSharing: string | null;
  version: string;
};

const uploadAvatarHeadersZod = z.object({
  acl: z.string(),
  algorithm: z.string(),
  credential: z.string(),
  date: z.string(),
  key: z.string(),
  policy: z.string(),
  signature: z.string(),
});
export type UploadAvatarHeadersType = z.infer<typeof uploadAvatarHeadersZod>;

const remoteConfigResponseZod = z.object({
  config: z
    .object({
      name: z.string(),
      enabled: z.boolean(),
      value: z.string().or(z.null()).optional(),
    })
    .array(),
  serverEpochTime: z.number(),
});
export type RemoteConfigResponseType = z.infer<typeof remoteConfigResponseZod>;

export type ProfileType = Readonly<{
  identityKey?: string;
  name?: string;
  about?: string;
  aboutEmoji?: string;
  avatar?: string;
  phoneNumberSharing?: string;
  unidentifiedAccess?: string;
  unrestrictedUnidentifiedAccess?: string;
  uuid?: string;
  credential?: string;

  capabilities?: CapabilitiesType;
  paymentAddress?: string;
  badges?: unknown;
}>;

export type GetAccountForUsernameOptionsType = Readonly<{
  hash: Uint8Array;
}>;

const getAccountForUsernameResultZod = z.object({
  uuid: aciSchema,
});

export type GetAccountForUsernameResultType = z.infer<
  typeof getAccountForUsernameResultZod
>;

export type GetIceServersResultType = Readonly<{
  username: string;
  password: string;
  urls?: ReadonlyArray<string>;
  urlsWithIps?: ReadonlyArray<string>;
  hostname?: string;
}>;

export type GetDevicesResultType = ReadonlyArray<
  Readonly<{
    id: number;
    name: string;
    lastSeen: number;
    created: number;
  }>
>;

export type GetSenderCertificateResultType = Readonly<{ certificate: string }>;

export type MakeProxiedRequestResultType =
  | Uint8Array
  | {
    result: BytesWithDetailsType;
    totalSize: number;
  };

const whoamiResultZod = z.object({
  uuid: z.string(),
  pni: z.string(),
  number: z.string(),
  username: z.string().or(z.null()).optional(),
});
export type WhoamiResultType = z.infer<typeof whoamiResultZod>;

export type CdsLookupOptionsType = Readonly<{
  e164s: ReadonlyArray<string>;
  acisAndAccessKeys?: ReadonlyArray<{ aci: AciString; accessKey: string }>;
  returnAcisWithoutUaks?: boolean;
  useLibsignal?: boolean;
}>;

type GetProfileCommonOptionsType = Readonly<
  {
    userLanguages: ReadonlyArray<string>;
  } & (
    | {
      profileKeyVersion?: undefined;
      profileKeyCredentialRequest?: undefined;
    }
    | {
      profileKeyVersion: string;
      profileKeyCredentialRequest?: string;
    }
  )
>;

export type GetProfileOptionsType = GetProfileCommonOptionsType &
  Readonly<{
    accessKey?: undefined;
  }>;

export type GetProfileUnauthOptionsType = GetProfileCommonOptionsType &
  Readonly<{
    accessKey: string;
  }>;

export type GetGroupCredentialsOptionsType = Readonly<{
  startDayInMs: number;
  endDayInMs: number;
}>;

export type GetGroupCredentialsResultType = Readonly<{
  pni?: UntaggedPniString | null;
  credentials: ReadonlyArray<GroupCredentialType>;
  callLinkAuthCredentials: ReadonlyArray<GroupCredentialType>;
}>;

const verifyServiceIdResponse = z.object({
  elements: z.array(
    z.object({
      uuid: serviceIdSchema,
      identityKey: z.string(),
    })
  ),
});

export type VerifyServiceIdRequestType = Array<{
  uuid: ServiceIdString;
  fingerprint: string;
}>;
export type VerifyServiceIdResponseType = z.infer<
  typeof verifyServiceIdResponse
>;

export type ReserveUsernameOptionsType = Readonly<{
  hashes: ReadonlyArray<Uint8Array>;
  abortSignal?: AbortSignal;
}>;

export type ReplaceUsernameLinkOptionsType = Readonly<{
  encryptedUsername: Uint8Array;
  keepLinkHandle: boolean;
}>;

export type ConfirmUsernameOptionsType = Readonly<{
  hash: Uint8Array;
  proof: Uint8Array;
  encryptedUsername: Uint8Array;
  abortSignal?: AbortSignal;
}>;

const reserveUsernameResultZod = z.object({
  usernameHash: z
    .string()
    .transform(x => fromBase64(fromWebSafeBase64(x))),
});
export type ReserveUsernameResultType = z.infer<
  typeof reserveUsernameResultZod
>;

const confirmUsernameResultZod = z.object({
  usernameLinkHandle: z.string(),
});
export type ConfirmUsernameResultType = z.infer<
  typeof confirmUsernameResultZod
>;

const replaceUsernameLinkResultZod = z.object({
  usernameLinkHandle: z.string(),
});
export type ReplaceUsernameLinkResultType = z.infer<
  typeof replaceUsernameLinkResultZod
>;

const resolveUsernameLinkResultZod = z.object({
  usernameLinkEncryptedValue: z
    .string()
    .transform(x => fromBase64(fromWebSafeBase64(x))),
});
export type ResolveUsernameLinkResultType = z.infer<
  typeof resolveUsernameLinkResultZod
>;

export type CreateAccountOptionsType = Readonly<{
  sessionId: string;
  number: string;
  code: string;
  newPassword: string;
  registrationId: number;
  pniRegistrationId: number;
  accessKey: Uint8Array;
  aciPublicKey: Uint8Array;
  pniPublicKey: Uint8Array;
  aciSignedPreKey: UploadSignedPreKeyType;
  pniSignedPreKey: UploadSignedPreKeyType;
  aciPqLastResortPreKey: UploadSignedPreKeyType;
  pniPqLastResortPreKey: UploadSignedPreKeyType;
}>;

const linkDeviceResultZod = z.object({
  uuid: aciSchema,
  pni: untaggedPniSchema,
  deviceId: z.number(),
});
export type LinkDeviceResultType = z.infer<typeof linkDeviceResultZod>;

export type ReportMessageOptionsType = Readonly<{
  senderAci: AciString;
  serverGuid: string;
  token?: string;
}>;

const attachmentUploadFormResponse = z.object({
  cdn: z.literal(2).or(z.literal(3)),
  key: z.string(),
  headers: z.record(z.string()),
  signedUploadLocation: z.string(),
});

export type AttachmentUploadFormResponseType = z.infer<
  typeof attachmentUploadFormResponse
>;

export type ServerKeyCountType = {
  count: number;
  pqCount: number;
};

export type LinkDeviceOptionsType = Readonly<{
  number: string;
  verificationCode: string;
  encryptedDeviceName?: string;
  newPassword: string;
  registrationId: number;
  pniRegistrationId: number;
  aciSignedPreKey: UploadSignedPreKeyType;
  pniSignedPreKey: UploadSignedPreKeyType;
  aciPqLastResortPreKey: UploadSignedPreKeyType;
  pniPqLastResortPreKey: UploadSignedPreKeyType;
}>;

const createAccountResultZod = z.object({
  uuid: aciSchema,
  pni: untaggedPniSchema,
});
export type CreateAccountResultType = z.infer<typeof createAccountResultZod>;

const verificationSessionZod = z.object({
  id: z.string(),
  allowedToRequestCode: z.boolean(),
  verified: z.boolean(),
});

export type RequestVerificationResultType = Readonly<{
  sessionId: string;
}>;

export type SetBackupIdOptionsType = Readonly<{
  backupAuthCredentialRequest: Uint8Array;
}>;

export type SetBackupSignatureKeyOptionsType = Readonly<{
  headers: BackupPresentationHeadersType;
  backupIdPublicKey: Uint8Array;
}>;

export type UploadBackupOptionsType = Readonly<{
  headers: BackupPresentationHeadersType;
  stream: Readable;
}>;

export type BackupMediaItemType = Readonly<{
  sourceAttachment: Readonly<{
    cdn: number;
    key: string;
  }>;
  objectLength: number;
  mediaId: string;
  hmacKey: Uint8Array;
  encryptionKey: Uint8Array;
  iv: Uint8Array;
}>;

export type BackupMediaBatchOptionsType = Readonly<{
  headers: BackupPresentationHeadersType;
  items: ReadonlyArray<BackupMediaItemType>;
}>;

export const backupMediaBatchResponseSchema = z.object({
  responses: z
    .object({
      status: z.number(),
      failureReason: z.string().or(z.null()).optional(),
      cdn: z.number(),
      mediaId: z.string(),
    })
    .transform(response => ({
      ...response,
      isSuccess: isSuccess(response.status),
    }))
    .array(),
});

export type BackupMediaBatchResponseType = z.infer<
  typeof backupMediaBatchResponseSchema
>;

export type BackupListMediaOptionsType = Readonly<{
  headers: BackupPresentationHeadersType;
  cursor?: string;
  limit: number;
}>;

export const backupListMediaResponseSchema = z.object({
  storedMediaObjects: z
    .object({
      cdn: z.number(),
      mediaId: z.string(),
      objectLength: z.number(),
    })
    .array(),
  backupDir: z.string(),
  mediaDir: z.string(),
  cursor: z.string().or(z.null()).optional(),
});

export type BackupListMediaResponseType = z.infer<
  typeof backupListMediaResponseSchema
>;

export type BackupDeleteMediaItemType = Readonly<{
  cdn: number;
  mediaId: string;
}>;

export type BackupDeleteMediaOptionsType = Readonly<{
  headers: BackupPresentationHeadersType;
  mediaToDelete: ReadonlyArray<BackupDeleteMediaItemType>;
}>;

export type GetBackupCredentialsOptionsType = Readonly<{
  startDayInMs: number;
  endDayInMs: number;
}>;

export const getBackupCredentialsResponseSchema = z.object({
  credentials: z
    .object({
      credential: z.string().transform(x => fromBase64(x)),
      redemptionTime: z
        .number()
        .transform(x => durations.DurationInSeconds.fromSeconds(x)),
    })
    .array(),
});

export type GetBackupCredentialsResponseType = z.infer<
  typeof getBackupCredentialsResponseSchema
>;

export type GetBackupCDNCredentialsOptionsType = Readonly<{
  headers: BackupPresentationHeadersType;
  cdn: number;
}>;

export const getBackupCDNCredentialsResponseSchema = z.object({
  headers: z.record(z.string(), z.string()),
});

export type GetBackupCDNCredentialsResponseType = z.infer<
  typeof getBackupCDNCredentialsResponseSchema
>;

export const getBackupInfoResponseSchema = z.object({
  cdn: z.number(),
  backupDir: z.string(),
  mediaDir: z.string(),
  backupName: z.string(),
  usedSpace: z.number().or(z.null()).optional(),
});

export type GetBackupInfoResponseType = z.infer<
  typeof getBackupInfoResponseSchema
>;

export type CallLinkCreateAuthResponseType = Readonly<{
  credential: string;
}>;

export const callLinkCreateAuthResponseSchema = z.object({
  credential: z.string(),
}) satisfies z.ZodSchema<CallLinkCreateAuthResponseType>;

const StickerPackUploadAttributesSchema = z.object({
  acl: z.string(),
  algorithm: z.string(),
  credential: z.string(),
  date: z.string(),
  id: z.number(),
  key: z.string(),
  policy: z.string(),
  signature: z.string(),
});

const StickerPackUploadFormSchema = z.object({
  packId: z.string(),
  manifest: StickerPackUploadAttributesSchema,
  stickers: z.array(StickerPackUploadAttributesSchema),
});

export type WebAPIType = {
  startRegistration(): unknown;
  finishRegistration(baton: unknown): void;
  cancelInflightRequests: (reason: string) => void;
  cdsLookup: (options: CdsLookupOptionsType) => Promise<CDSResponseType>;
  createAccount: (
    options: CreateAccountOptionsType
  ) => Promise<CreateAccountResultType>;
  createGroup: (
    group: Proto.IGroup,
    options: GroupCredentialsType
  ) => Promise<Proto.IGroupResponse>;
  deleteUsername: (abortSignal?: AbortSignal) => Promise<void>;
  downloadOnboardingStories: (
    version: string,
    imageFiles: Array<string>
  ) => Promise<Array<Uint8Array>>;
  getAttachmentFromBackupTier: (args: {
    mediaId: string;
    backupDir: string;
    mediaDir: string;
    cdnNumber: number;
    headers: Record<string, string>;
    options?: {
      disableRetries?: boolean;
      timeout?: number;
    };
  }) => Promise<Readable>;
  getAttachment: (args: {
    cdnKey: string;
    cdnNumber?: number;
    options?: {
      disableRetries?: boolean;
      timeout?: number;
    };
  }) => Promise<Readable>;
  getAttachmentUploadForm: () => Promise<AttachmentUploadFormResponseType>;
  getAvatar: (path: string) => Promise<Uint8Array>;
  getHasSubscription: (subscriberId: Uint8Array) => Promise<boolean>;
  getGroup: (options: GroupCredentialsType) => Promise<Proto.IGroupResponse>;
  getGroupFromLink: (
    inviteLinkPassword: string | undefined,
    auth: GroupCredentialsType
  ) => Promise<Proto.GroupJoinInfo>;
  getGroupAvatar: (key: string) => Promise<Uint8Array>;
  getGroupCredentials: (
    options: GetGroupCredentialsOptionsType
  ) => Promise<GetGroupCredentialsResultType>;
  getExternalGroupCredential: (
    options: GroupCredentialsType
  ) => Promise<Proto.IExternalGroupCredential>;
  getGroupLog: (
    options: GetGroupLogOptionsType,
    credentials: GroupCredentialsType
  ) => Promise<GroupLogResponseType>;
  getIceServers: () => Promise<GetIceServersResultType>;
  getKeysForServiceId: (
    serviceId: ServiceIdString,
    deviceId?: number
  ) => Promise<ServerKeysType>;
  getKeysForServiceIdUnauth: (
    serviceId: ServiceIdString,
    deviceId?: number,
    options?: { accessKey?: string }
  ) => Promise<ServerKeysType>;
  getMyKeyCounts: (serviceIdKind: ServiceIdKind) => Promise<ServerKeyCountType>;
  getOnboardingStoryManifest: () => Promise<{
    version: string;
    languages: Record<string, Array<string>>;
  }>;
  getProfile: (
    serviceId: ServiceIdString,
    options: GetProfileOptionsType
  ) => Promise<ProfileType>;
  getAccountForUsername: (
    options: GetAccountForUsernameOptionsType
  ) => Promise<GetAccountForUsernameResultType>;
  getProfileUnauth: (
    serviceId: ServiceIdString,
    options: GetProfileUnauthOptionsType
  ) => Promise<ProfileType>;
  getBadgeImageFile: (imageUrl: string) => Promise<Uint8Array>;
  getSubscriptionConfiguration: (
    userLanguages: ReadonlyArray<string>
  ) => Promise<unknown>;
  getProvisioningResource: (
    handler: IRequestHandler
  ) => Promise<IWebSocketResource>;
  getSenderCertificate: (
    withUuid?: boolean
  ) => Promise<GetSenderCertificateResultType>;
  getSticker: (packId: string, stickerId: number) => Promise<Uint8Array>;
  getStickerPackManifest: (packId: string) => Promise<StickerPackManifestType>;
  getStorageCredentials: MessageSender['getStorageCredentials'];
  getStorageManifest: MessageSender['getStorageManifest'];
  getStorageRecords: MessageSender['getStorageRecords'];
  fetchLinkPreviewMetadata: (
    href: string,
    abortSignal: AbortSignal
  ) => Promise<null | linkPreviewFetch.LinkPreviewMetadata>;
  fetchLinkPreviewImage: (
    href: string,
    abortSignal: AbortSignal
  ) => Promise<null | linkPreviewFetch.LinkPreviewImage>;
  linkDevice: (options: LinkDeviceOptionsType) => Promise<LinkDeviceResultType>;
  makeProxiedRequest: (
    targetUrl: string,
    options?: ProxiedRequestOptionsType
  ) => Promise<MakeProxiedRequestResultType>;
  makeSfuRequest: (
    targetUrl: string,
    type: HTTPCodeType,
    headers: HeaderListType,
    body: Uint8Array | undefined
  ) => Promise<BytesWithDetailsType>;
  modifyGroup: (
    changes: Proto.GroupChange.IActions,
    options: GroupCredentialsType,
    inviteLinkBase64?: string
  ) => Promise<Proto.IGroupChangeResponse>;
  modifyStorageRecords: MessageSender['modifyStorageRecords'];
  postBatchIdentityCheck: (
    elements: VerifyServiceIdRequestType
  ) => Promise<VerifyServiceIdResponseType>;
  putEncryptedAttachment: (
    encryptedBin: (start: number, end?: number) => Readable,
    encryptedSize: number,
    uploadForm: AttachmentUploadFormResponseType
  ) => Promise<void>;
  putProfile: (
    jsonData: ProfileRequestDataType
  ) => Promise<UploadAvatarHeadersType | undefined>;
  putStickers: (
    encryptedManifest: Uint8Array,
    encryptedStickers: ReadonlyArray<Uint8Array>,
    onProgress?: () => void
  ) => Promise<string>;
  reserveUsername: (
    options: ReserveUsernameOptionsType
  ) => Promise<ReserveUsernameResultType>;
  confirmUsername(
    options: ConfirmUsernameOptionsType
  ): Promise<ConfirmUsernameResultType>;
  replaceUsernameLink: (
    options: ReplaceUsernameLinkOptionsType
  ) => Promise<ReplaceUsernameLinkResultType>;
  deleteUsernameLink: () => Promise<void>;
  resolveUsernameLink: (
    serverId: string
  ) => Promise<ResolveUsernameLinkResultType>;
  registerCapabilities: (capabilities: CapabilitiesUploadType) => Promise<void>;
  registerKeys: (
    genKeys: UploadKeysType,
    serviceIdKind: ServiceIdKind
  ) => Promise<void>;
  registerSupportForUnauthenticatedDelivery: () => Promise<void>;
  reportMessage: (options: ReportMessageOptionsType) => Promise<void>;
  requestVerification: (
    number: string,
    captcha: string,
    transport: VerificationTransport
  ) => Promise<RequestVerificationResultType>;
  checkAccountExistence: (serviceId: ServiceIdString) => Promise<boolean>;
  sendMessages: (
    destination: ServiceIdString,
    messageArray: ReadonlyArray<MessageType>,
    timestamp: number,
    options: { online?: boolean; story?: boolean; urgent?: boolean }
  ) => Promise<void>;
  sendMessagesUnauth: (
    destination: ServiceIdString,
    messageArray: ReadonlyArray<MessageType>,
    timestamp: number,
    options: {
      accessKey?: string;
      online?: boolean;
      story?: boolean;
      urgent?: boolean;
    }
  ) => Promise<void>;
  sendWithSenderKey: (
    payload: Uint8Array,
    accessKeys: Uint8Array,
    timestamp: number,
    options: {
      online?: boolean;
      story?: boolean;
      urgent?: boolean;
    }
  ) => Promise<MultiRecipient200ResponseType>;
  createFetchForAttachmentUpload(
    attachment: AttachmentUploadFormResponseType
  ): FetchFunctionType;
  getBackupInfo: (
    headers: BackupPresentationHeadersType
  ) => Promise<GetBackupInfoResponseType>;
  getBackupUploadForm: (
    headers: BackupPresentationHeadersType
  ) => Promise<AttachmentUploadFormResponseType>;
  getBackupMediaUploadForm: (
    headers: BackupPresentationHeadersType
  ) => Promise<AttachmentUploadFormResponseType>;
  refreshBackup: (headers: BackupPresentationHeadersType) => Promise<void>;
  getBackupCredentials: (
    options: GetBackupCredentialsOptionsType
  ) => Promise<GetBackupCredentialsResponseType>;
  getBackupCDNCredentials: (
    options: GetBackupCDNCredentialsOptionsType
  ) => Promise<GetBackupCDNCredentialsResponseType>;
  setBackupId: (options: SetBackupIdOptionsType) => Promise<void>;
  setBackupSignatureKey: (
    options: SetBackupSignatureKeyOptionsType
  ) => Promise<void>;
  backupMediaBatch: (
    options: BackupMediaBatchOptionsType
  ) => Promise<BackupMediaBatchResponseType>;
  backupListMedia: (
    options: BackupListMediaOptionsType
  ) => Promise<BackupListMediaResponseType>;
  backupDeleteMedia: (options: BackupDeleteMediaOptionsType) => Promise<void>;
  callLinkCreateAuth: (
    requestBase64: string
  ) => Promise<CallLinkCreateAuthResponseType>;
  setPhoneNumberDiscoverability: (newValue: boolean) => Promise<void>;
  updateDeviceName: (deviceName: string) => Promise<void>;
  uploadAvatar: (
    uploadAvatarRequestHeaders: UploadAvatarHeadersType,
    avatarData: Uint8Array
  ) => Promise<string>;
  uploadGroupAvatar: (
    avatarData: Uint8Array,
    options: GroupCredentialsType
  ) => Promise<string>;
  whoami: () => Promise<WhoamiResultType>;
  sendChallengeResponse: (challengeResponse: ChallengeType) => Promise<void>;
  getConfig: () => Promise<RemoteConfigResponseType>;
  authenticate: (credentials: WebAPICredentials) => Promise<void>;
  logout: () => Promise<void>;
  getSocketStatus: () => SocketStatus;
  registerRequestHandler: (handler: IRequestHandler) => void;
  unregisterRequestHandler: (handler: IRequestHandler) => void;
  onHasStoriesDisabledChange: (newValue: boolean) => void;
  checkSockets: () => void;
  isOnline: () => boolean | undefined;
  onNavigatorOnline: () => Promise<void>;
  onNavigatorOffline: () => Promise<void>;
  onRemoteExpiration: () => Promise<void>;
  reconnect: () => Promise<void>;
};

export type UploadSignedPreKeyType = {
  keyId: number;
  publicKey: Uint8Array;
  signature: Uint8Array;
};
export type UploadPreKeyType = {
  keyId: number;
  publicKey: Uint8Array;
};
export type UploadKyberPreKeyType = UploadSignedPreKeyType;

type SerializedSignedPreKeyType = Readonly<{
  keyId: number;
  publicKey: string;
  signature: string;
}>;

export type UploadKeysType = {
  identityKey: Uint8Array;

  // If a field is not provided, the server won't update its data.
  preKeys?: Array<UploadPreKeyType>;
  pqPreKeys?: Array<UploadSignedPreKeyType>;
  pqLastResortPreKey?: UploadSignedPreKeyType;
  signedPreKey?: UploadSignedPreKeyType;
};

export type ServerKeysType = {
  devices: Array<{
    deviceId: number;
    registrationId: number;

    // We'll get a 404 if none of these keys are provided; we'll have at least one
    preKey?: {
      keyId: number;
      publicKey: Uint8Array;
    };
    signedPreKey?: {
      keyId: number;
      publicKey: Uint8Array;
      signature: Uint8Array;
    };
    pqPreKey?: {
      keyId: number;
      publicKey: Uint8Array;
      signature: Uint8Array;
    };
  }>;
  identityKey: Uint8Array;
};

export type ChallengeType = {
  readonly type: 'captcha';
  readonly token: string;
  readonly captcha: string;
};

export type ProxiedRequestOptionsType = {
  returnUint8Array?: boolean;
  start?: number;
  end?: number;
};

export type TopLevelType = {
  multiRecipient200ResponseSchema: typeof multiRecipient200ResponseSchema;
  multiRecipient409ResponseSchema: typeof multiRecipient409ResponseSchema;
  multiRecipient410ResponseSchema: typeof multiRecipient410ResponseSchema;
  initialize: (options: InitializeOptionsType) => WebAPIConnectType;
};

type InflightCallback = (error: Error) => unknown;

// We first set up the data that won't change during this session of the app
export function initialize({
  url,
  storageUrl,
  updatesUrl,
  resourcesUrl,
  directoryConfig,
  cdnUrlObject,
  certificateAuthority,
  contentProxyUrl,
  proxyUrl,
  version,
  disableIPv6,
}: InitializeOptionsType): WebAPIConnectType {
  if (!isString(url)) {
    throw new Error('WebAPI.initialize: Invalid server url');
  }
  if (!isString(storageUrl)) {
    throw new Error('WebAPI.initialize: Invalid storageUrl');
  }
  if (!isString(updatesUrl)) {
    throw new Error('WebAPI.initialize: Invalid updatesUrl');
  }
  if (!isString(resourcesUrl)) {
    throw new Error('WebAPI.initialize: Invalid updatesUrl (general)');
  }
  if (!isObject(cdnUrlObject)) {
    throw new Error('WebAPI.initialize: Invalid cdnUrlObject');
  }
  if (!isString(cdnUrlObject['0'])) {
    throw new Error('WebAPI.initialize: Missing CDN 0 configuration');
  }
  if (!isString(cdnUrlObject['2'])) {
    throw new Error('WebAPI.initialize: Missing CDN 2 configuration');
  }
  if (!isString(cdnUrlObject['3'])) {
    throw new Error('WebAPI.initialize: Missing CDN 3 configuration');
  }
  if (!isString(certificateAuthority)) {
    throw new Error('WebAPI.initialize: Invalid certificateAuthority');
  }
  if (!isString(contentProxyUrl)) {
    throw new Error('WebAPI.initialize: Invalid contentProxyUrl');
  }
  if (proxyUrl && !isString(proxyUrl)) {
    throw new Error('WebAPI.initialize: Invalid proxyUrl');
  }
  if (!isString(version)) {
    throw new Error('WebAPI.initialize: Invalid version');
  }

  // `libsignalNet` is an instance of a class from libsignal that is responsible
  // for providing network layer API and related functionality.
  // It's important to have a single instance of this class as it holds
  // resources that are shared across all other use cases.
  const env = resolveLibsignalNetEnvironment(getEnvironment(), url);
  log.info(`libsignal net environment resolved to [${Net.Environment[env]}]`);
  const libsignalNet = new Net.Net(env, getUserAgent(version));
  libsignalNet.setIpv6Enabled(!disableIPv6);

  // Thanks to function-hoisting, we can put this return statement before all of the
  //   below function definitions.
  return {
    connect,
  };

  // Then we connect to the server with user-specific information. This is the only API
  //   exposed to the browser context, ensuring that it can't connect to arbitrary
  //   locations.
  function connect({
    username: initialUsername,
    password: initialPassword,
    useWebSocket = true,
    hasStoriesDisabled,
  }: WebAPIConnectOptionsType) {
    let username = initialUsername;
    let password = initialPassword;
    const PARSE_RANGE_HEADER = /\/(\d+)$/;
    const PARSE_GROUP_LOG_RANGE_HEADER =
      /^versions\s+(\d{1,10})-(\d{1,10})\/(\d{1,10})/;

    let activeRegistration: ExplodePromiseResultType<void> | undefined;

    const socketManager = new SocketManager(libsignalNet, {
      url,
      certificateAuthority,
      version,
      proxyUrl,
      hasStoriesDisabled,
    });

    socketManager.on('statusChange', () => {
      window.Whisper.events.trigger('socketStatusChange');
    });

    socketManager.on('online', () => {
      window.Whisper.events.trigger('online');
    });

    socketManager.on('offline', () => {
      window.Whisper.events.trigger('offline');
    });

    socketManager.on('authError', () => {
      window.Whisper.events.trigger('unlinkAndDisconnect');
    });

    if (useWebSocket) {
      void socketManager.authenticate({ username, password });
    }

    const { directoryUrl, directoryMRENCLAVE } = directoryConfig;

    const cds = new CDSI(libsignalNet, {
      logger: log,
      proxyUrl,

      url: directoryUrl,
      mrenclave: directoryMRENCLAVE,
      certificateAuthority,
      version,

      async getAuth() {
        return (await _ajax({
          call: 'directoryAuthV2',
          httpType: 'GET',
          responseType: 'json',
        })) as CDSAuthType;
      },
    });

    const inflightRequests = new Set<(error: Error) => unknown>();
    function registerInflightRequest(request: InflightCallback) {
      inflightRequests.add(request);
    }
    function unregisterInFlightRequest(request: InflightCallback) {
      inflightRequests.delete(request);
    }
    function cancelInflightRequests(reason: string) {
      const logId = `cancelInflightRequests/${reason}`;
      log.warn(`${logId}: Cancelling ${inflightRequests.size} requests`);
      for (const request of inflightRequests) {
        try {
          request(new Error(`${logId}: Cancelled!`));
        } catch (error: unknown) {
          log.error(
            `${logId}: Failed to cancel request: ${toLogFormat(error)}`
          );
        }
      }
      inflightRequests.clear();
      log.warn(`${logId}: Done`);
    }

    let fetchAgent: Agent | undefined;
    const fetchForLinkPreviews: linkPreviewFetch.FetchFn = async (
      href,
      init
    ) => {
      if (!fetchAgent) {
        if (proxyUrl) {
          fetchAgent = await createProxyAgent(proxyUrl);
        } else {
          fetchAgent = createHTTPSAgent({
            keepAlive: false,
            maxCachedSessions: 0,
          });
        }
      }
      return fetch(href, { ...init, agent: fetchAgent });
    };

    // Thanks, function hoisting!
    return {
      authenticate,
      backupDeleteMedia,
      backupListMedia,
      backupMediaBatch,
      cancelInflightRequests,
      cdsLookup,
      checkAccountExistence,
      checkSockets,
      createAccount,
      callLinkCreateAuth,
      createFetchForAttachmentUpload,
      confirmUsername,
      createGroup,
      deleteUsername,
      deleteUsernameLink,
      downloadOnboardingStories,
      fetchLinkPreviewImage,
      fetchLinkPreviewMetadata,
      finishRegistration,
      getAccountForUsername,
      getAttachment,
      getAttachmentFromBackupTier,
      getAttachmentUploadForm,
      getAvatar,
      getBackupCredentials,
      getBackupCDNCredentials,
      getBackupInfo,
      getBackupMediaUploadForm,
      getBackupUploadForm,
      getBadgeImageFile,
      getConfig,
      getGroup,
      getGroupAvatar,
      getGroupCredentials,
      getExternalGroupCredential,
      getGroupFromLink,
      getGroupLog,
      getHasSubscription,
      getIceServers,
      getKeysForServiceId,
      getKeysForServiceIdUnauth,
      getMyKeyCounts,
      getOnboardingStoryManifest,
      getProfile,
      getProfileUnauth,
      getProvisioningResource,
      getSenderCertificate,
      getSocketStatus,
      getSticker,
      getStickerPackManifest,
      getStorageCredentials,
      getStorageManifest,
      getStorageRecords,
      getSubscriptionConfiguration,
      linkDevice,
      logout,
      makeProxiedRequest,
      makeSfuRequest,
      modifyGroup,
      modifyStorageRecords,
      onHasStoriesDisabledChange,
      isOnline,
      onNavigatorOffline,
      onNavigatorOnline,
      onRemoteExpiration,
      postBatchIdentityCheck,
      putEncryptedAttachment,
      putProfile,
      putStickers,
      reconnect,
      refreshBackup,
      registerCapabilities,
      registerKeys,
      registerRequestHandler,
      registerSupportForUnauthenticatedDelivery,
      resolveUsernameLink,
      replaceUsernameLink,
      reportMessage,
      requestVerification,
      reserveUsername,
      sendChallengeResponse,
      sendMessages,
      sendMessagesUnauth,
      sendWithSenderKey,
      setBackupId,
      setBackupSignatureKey,
      setPhoneNumberDiscoverability,
      startRegistration,
      unregisterRequestHandler,
      updateDeviceName,
      uploadAvatar,
      uploadGroupAvatar,
      whoami,
    };

    function _ajax(
      param: AjaxOptionsType & { responseType?: 'bytes' }
    ): Promise<Uint8Array>;
    function _ajax(
      param: AjaxOptionsType & { responseType: 'byteswithdetails' }
    ): Promise<BytesWithDetailsType>;
    function _ajax(
      param: AjaxOptionsType & { responseType: 'stream' }
    ): Promise<Readable>;
    function _ajax(
      param: AjaxOptionsType & { responseType: 'json' }
    ): Promise<unknown>;

    async function _ajax(param: AjaxOptionsType): Promise<unknown> {
      if (
        !param.unauthenticated &&
        activeRegistration &&
        !param.isRegistration
      ) {
        log.info('WebAPI: request blocked by active registration');
        const start = Date.now();
        await activeRegistration.promise;
        const duration = Date.now() - start;
        log.info(`WebAPI: request unblocked after ${duration}ms`);
      }

      if (!param.urlParameters) {
        param.urlParameters = '';
      }

      const useWebSocketForEndpoint =
        useWebSocket && WEBSOCKET_CALLS.has(param.call);

      const outerParams = {
        socketManager: useWebSocketForEndpoint ? socketManager : undefined,
        basicAuth: param.basicAuth,
        certificateAuthority,
        contentType: param.contentType || 'application/json; charset=utf-8',
        data:
          param.data ||
          (param.jsonData ? JSON.stringify(param.jsonData) : undefined),
        headers: param.headers,
        host: param.host || url,
        password: param.password ?? password,
        path: URL_CALLS[param.call] + param.urlParameters,
        proxyUrl,
        responseType: param.responseType,
        timeout: param.timeout,
        type: param.httpType,
        user: param.username ?? username,
        redactUrl: param.redactUrl,
        serverUrl: url,
        validateResponse: param.validateResponse,
        version,
        unauthenticated: param.unauthenticated,
        accessKey: param.accessKey,
        abortSignal: param.abortSignal,
      };

      try {
        return await _outerAjax(null, outerParams);
      } catch (e) {
        if (!(e instanceof HTTPError)) {
          throw e;
        }
        const translatedError = translateError(e);
        if (translatedError) {
          throw translatedError;
        }
        throw e;
      }
    }

    function serializeSignedPreKey(
      preKey?: UploadSignedPreKeyType
    ): SerializedSignedPreKeyType | undefined {
      if (preKey == null) {
        return undefined;
      }

      const { keyId, publicKey, signature } = preKey;

      return {
        keyId,
        publicKey: toBase64(publicKey),
        signature: toBase64(signature),
      };
    }

    function serviceIdKindToQuery(kind: ServiceIdKind): string {
      let value: string;
      if (kind === ServiceIdKind.ACI) {
        value = 'aci';
      } else if (kind === ServiceIdKind.PNI) {
        value = 'pni';
      } else {
        throw new Error(`Unsupported ServiceIdKind: ${kind}`);
      }
      return `identity=${value}`;
    }

    async function whoami(): Promise<WhoamiResultType> {
      const response = await _ajax({
        call: 'whoami',
        httpType: 'GET',
        responseType: 'json',
      });

      return whoamiResultZod.parse(response);
    }

    async function sendChallengeResponse(challengeResponse: ChallengeType) {
      await _ajax({
        call: 'challenge',
        httpType: 'PUT',
        jsonData: challengeResponse,
      });
    }

    async function authenticate({
      username: newUsername,
      password: newPassword,
    }: WebAPICredentials) {
      username = newUsername;
      password = newPassword;

      if (useWebSocket) {
        await socketManager.authenticate({ username, password });
      }
    }

    async function logout() {
      username = '';
      password = '';

      if (useWebSocket) {
        await socketManager.logout();
      }
    }

    function getSocketStatus(): SocketStatus {
      return socketManager.getStatus();
    }

    function checkSockets(): void {
      // Intentionally not awaiting
      void socketManager.check();
    }

    function isOnline(): boolean | undefined {
      return socketManager.isOnline;
    }

    async function onNavigatorOnline(): Promise<void> {
      await socketManager.onNavigatorOnline();
    }

    async function onNavigatorOffline(): Promise<void> {
      await socketManager.onNavigatorOffline();
    }

    async function onRemoteExpiration(): Promise<void> {
      await socketManager.onRemoteExpiration();
    }

    async function reconnect(): Promise<void> {
      await socketManager.reconnect();
    }

    function registerRequestHandler(handler: IRequestHandler): void {
      socketManager.registerRequestHandler(handler);
    }

    function unregisterRequestHandler(handler: IRequestHandler): void {
      socketManager.unregisterRequestHandler(handler);
    }

    function onHasStoriesDisabledChange(newValue: boolean): void {
      void socketManager.onHasStoriesDisabledChange(newValue);
    }

    async function getConfig() {
      const rawRes = await _ajax({
        call: 'config',
        httpType: 'GET',
        responseType: 'json',
      });
      const res = remoteConfigResponseZod.parse(rawRes);

      return {
        ...res,
        config: res.config.filter(
          ({ name }: { name: string }) =>
            name.startsWith('desktop.') ||
            name.startsWith('global.') ||
            name.startsWith('cds.')
        ),
      };
    }

    async function getSenderCertificate(omitE164?: boolean) {
      return (await _ajax({
        call: 'deliveryCert',
        httpType: 'GET',
        responseType: 'json',
        validateResponse: { certificate: 'string' },
        ...(omitE164 ? { urlParameters: '?includeE164=false' } : {}),
      })) as GetSenderCertificateResultType;
    }

    async function getStorageCredentials(): Promise<StorageServiceCredentials> {
      return (await _ajax({
        call: 'storageToken',
        httpType: 'GET',
        responseType: 'json',
        schema: { username: 'string', password: 'string' },
      })) as StorageServiceCredentials;
    }

    async function getOnboardingStoryManifest() {
      const res = await _ajax({
        call: 'getOnboardingStoryManifest',
        host: resourcesUrl,
        httpType: 'GET',
        responseType: 'json',
      });

      return res as {
        version: string;
        languages: Record<string, Array<string>>;
      };
    }

    async function getStorageManifest(
      options: StorageServiceCallOptionsType = {}
    ): Promise<Uint8Array> {
      const { credentials, greaterThanVersion } = options;

      const { data, response } = await _ajax({
        call: 'storageManifest',
        contentType: 'application/x-protobuf',
        host: storageUrl,
        httpType: 'GET',
        responseType: 'byteswithdetails',
        urlParameters: greaterThanVersion
          ? `/version/${greaterThanVersion}`
          : '',
        ...credentials,
      });

      if (response.status === 204) {
        throw makeHTTPError(
          'promiseAjax: error response',
          response.status,
          response.headers.raw(),
          data,
          new Error().stack
        );
      }

      return data;
    }

    async function getStorageRecords(
      data: Uint8Array,
      options: StorageServiceCallOptionsType = {}
    ): Promise<Uint8Array> {
      const { credentials } = options;

      return _ajax({
        call: 'storageRead',
        contentType: 'application/x-protobuf',
        data,
        host: storageUrl,
        httpType: 'PUT',
        responseType: 'bytes',
        ...credentials,
      });
    }

    async function modifyStorageRecords(
      data: Uint8Array,
      options: StorageServiceCallOptionsType = {}
    ): Promise<Uint8Array> {
      const { credentials } = options;

      return _ajax({
        call: 'storageModify',
        contentType: 'application/x-protobuf',
        data,
        host: storageUrl,
        httpType: 'PUT',
        // If we run into a conflict, the current manifest is returned -
        //   it will will be an Uint8Array at the response key on the Error
        responseType: 'bytes',
        ...credentials,
      });
    }

    async function registerSupportForUnauthenticatedDelivery() {
      await _ajax({
        call: 'supportUnauthenticatedDelivery',
        httpType: 'PUT',
        responseType: 'json',
      });
    }

    async function registerCapabilities(capabilities: CapabilitiesUploadType) {
      await _ajax({
        call: 'registerCapabilities',
        httpType: 'PUT',
        jsonData: capabilities,
      });
    }

    async function postBatchIdentityCheck(
      elements: VerifyServiceIdRequestType
    ) {
      const res = await _ajax({
        data: JSON.stringify({ elements }),
        call: 'batchIdentityCheck',
        httpType: 'POST',
        responseType: 'json',
      });

      const result = verifyServiceIdResponse.safeParse(res);

      if (result.success) {
        return result.data;
      }

      log.warn(
        'WebAPI: invalid response from postBatchIdentityCheck',
        toLogFormat(result.error)
      );

      throw result.error;
    }

    function getProfileUrl(
      serviceId: ServiceIdString,
      {
        profileKeyVersion,
        profileKeyCredentialRequest,
      }: GetProfileCommonOptionsType
    ) {
      let profileUrl = `/${serviceId}`;
      if (profileKeyVersion !== undefined) {
        profileUrl += `/${profileKeyVersion}`;
        if (profileKeyCredentialRequest !== undefined) {
          profileUrl +=
            `/${profileKeyCredentialRequest}` +
            '?credentialType=expiringProfileKey';
        }
      } else {
        strictAssert(
          profileKeyCredentialRequest === undefined,
          'getProfileUrl called without version, but with request'
        );
      }

      return profileUrl;
    }

    async function getProfile(
      serviceId: ServiceIdString,
      options: GetProfileOptionsType
    ) {
      const { profileKeyVersion, profileKeyCredentialRequest, userLanguages } =
        options;

      return (await _ajax({
        call: 'profile',
        httpType: 'GET',
        urlParameters: getProfileUrl(serviceId, options),
        headers: {
          'Accept-Language': formatAcceptLanguageHeader(userLanguages),
        },
        responseType: 'json',
        redactUrl: _createRedactor(
          serviceId,
          profileKeyVersion,
          profileKeyCredentialRequest
        ),
      })) as ProfileType;
    }

    async function getAccountForUsername({
      hash,
    }: GetAccountForUsernameOptionsType) {
      const hashBase64 = toWebSafeBase64(toBase64(hash));
      return getAccountForUsernameResultZod.parse(
        await _ajax({
          call: 'username',
          httpType: 'GET',
          urlParameters: `/${hashBase64}`,
          responseType: 'json',
          redactUrl: _createRedactor(hashBase64),
          unauthenticated: true,
          accessKey: undefined,
        })
      );
    }

    async function putProfile(
      jsonData: ProfileRequestDataType
    ): Promise<UploadAvatarHeadersType | undefined> {
      const res = await _ajax({
        call: 'profile',
        httpType: 'PUT',
        responseType: 'json',
        jsonData,
      });

      if (!res) {
        return;
      }

      return uploadAvatarHeadersZod.parse(res);
    }

    async function getProfileUnauth(
      serviceId: ServiceIdString,
      options: GetProfileUnauthOptionsType
    ) {
      const {
        accessKey,
        profileKeyVersion,
        profileKeyCredentialRequest,
        userLanguages,
      } = options;

      return (await _ajax({
        call: 'profile',
        httpType: 'GET',
        urlParameters: getProfileUrl(serviceId, options),
        headers: {
          'Accept-Language': formatAcceptLanguageHeader(userLanguages),
        },
        responseType: 'json',
        unauthenticated: true,
        accessKey,
        redactUrl: _createRedactor(
          serviceId,
          profileKeyVersion,
          profileKeyCredentialRequest
        ),
      })) as ProfileType;
    }

    async function getBadgeImageFile(
      imageFileUrl: string
    ): Promise<Uint8Array> {
      strictAssert(
        isBadgeImageFileUrlValid(imageFileUrl, updatesUrl),
        'getBadgeImageFile got an invalid URL. Was bad data saved?'
      );

      return _outerAjax(imageFileUrl, {
        certificateAuthority,
        contentType: 'application/octet-stream',
        proxyUrl,
        responseType: 'bytes',
        timeout: 0,
        type: 'GET',
        redactUrl: (href: string) => {
          const parsedUrl = maybeParseUrl(href);
          if (!parsedUrl) {
            return href;
          }
          const { pathname } = parsedUrl;
          const pattern = RegExp(escapeRegExp(pathname), 'g');
          return href.replace(pattern, `[REDACTED]${pathname.slice(-3)}`);
        },
        version,
      });
    }

    async function downloadOnboardingStories(
      manifestVersion: string,
      imageFiles: Array<string>
    ): Promise<Array<Uint8Array>> {
      return Promise.all(
        imageFiles.map(fileName =>
          _outerAjax(
            `${resourcesUrl}/static/desktop/stories/onboarding/${manifestVersion}/${fileName}.jpg`,
            {
              certificateAuthority,
              contentType: 'application/octet-stream',
              proxyUrl,
              responseType: 'bytes',
              timeout: 0,
              type: 'GET',
              version,
            }
          )
        )
      );
    }

    async function getSubscriptionConfiguration(
      userLanguages: ReadonlyArray<string>
    ): Promise<unknown> {
      return _ajax({
        call: 'subscriptionConfiguration',
        httpType: 'GET',
        headers: {
          'Accept-Language': formatAcceptLanguageHeader(userLanguages),
        },
        responseType: 'json',
      });
    }

    async function getAvatar(path: string) {
      // Using _outerAJAX, since it's not hardcoded to the Signal Server. Unlike our
      //   attachment CDN, it uses our self-signed certificate, so we pass it in.
      return _outerAjax(`${cdnUrlObject['0']}/${path}`, {
        certificateAuthority,
        contentType: 'application/octet-stream',
        proxyUrl,
        responseType: 'bytes',
        timeout: 90 * SECOND,
        type: 'GET',
        redactUrl: (href: string) => {
          const pattern = RegExp(escapeRegExp(path), 'g');
          return href.replace(pattern, `[REDACTED]${path.slice(-3)}`);
        },
        version,
      });
    }

    async function deleteUsername(abortSignal?: AbortSignal) {
      await _ajax({
        call: 'username',
        httpType: 'DELETE',
        abortSignal,
      });
    }

    async function reserveUsername({
      hashes,
      abortSignal,
    }: ReserveUsernameOptionsType) {
      const response = await _ajax({
        call: 'reserveUsername',
        httpType: 'PUT',
        jsonData: {
          usernameHashes: hashes.map(hash =>
            toWebSafeBase64(toBase64(hash))
          ),
        },
        responseType: 'json',
        abortSignal,
      });

      return reserveUsernameResultZod.parse(response);
    }
    async function confirmUsername({
      hash,
      proof,
      encryptedUsername,
      abortSignal,
    }: ConfirmUsernameOptionsType) {
      const response = await _ajax({
        call: 'confirmUsername',
        httpType: 'PUT',
        jsonData: {
          usernameHash: toWebSafeBase64(toBase64(hash)),
          zkProof: toWebSafeBase64(toBase64(proof)),
          encryptedUsername: toWebSafeBase64(toBase64(encryptedUsername)),
        },
        responseType: 'json',
        abortSignal,
      });
      return confirmUsernameResultZod.parse(response);
    }

    async function replaceUsernameLink({
      encryptedUsername,
      keepLinkHandle,
    }: ReplaceUsernameLinkOptionsType): Promise<ReplaceUsernameLinkResultType> {
      return replaceUsernameLinkResultZod.parse(
        await _ajax({
          call: 'usernameLink',
          httpType: 'PUT',
          responseType: 'json',
          jsonData: {
            usernameLinkEncryptedValue: toWebSafeBase64(
              toBase64(encryptedUsername)
            ),
            keepLinkHandle,
          },
        })
      );
    }

    async function deleteUsernameLink(): Promise<void> {
      await _ajax({
        call: 'usernameLink',
        httpType: 'DELETE',
      });
    }

    async function resolveUsernameLink(
      serverId: string
    ): Promise<ResolveUsernameLinkResultType> {
      return resolveUsernameLinkResultZod.parse(
        await _ajax({
          httpType: 'GET',
          call: 'usernameLink',
          urlParameters: `/${encodeURIComponent(serverId)}`,
          responseType: 'json',
          unauthenticated: true,
          accessKey: undefined,
        })
      );
    }

    async function reportMessage({
      senderAci,
      serverGuid,
      token,
    }: ReportMessageOptionsType): Promise<void> {
      const jsonData = { token };

      await _ajax({
        call: 'reportMessage',
        httpType: 'POST',
        urlParameters: urlPathFromComponents([senderAci, serverGuid]),
        responseType: 'bytes',
        jsonData,
      });
    }

    async function requestVerification(
      number: string,
      captcha: string,
      transport: VerificationTransport
    ) {
      // Create a new blank session using just a E164
      let session = verificationSessionZod.parse(
        await _ajax({
          call: 'verificationSession',
          httpType: 'POST',
          responseType: 'json',
          jsonData: {
            number,
          },
          unauthenticated: true,
          accessKey: undefined,
        })
      );

      // Submit a captcha solution to the session
      session = verificationSessionZod.parse(
        await _ajax({
          call: 'verificationSession',
          httpType: 'PATCH',
          urlParameters: `/${encodeURIComponent(session.id)}`,
          responseType: 'json',
          jsonData: {
            captcha,
          },
          unauthenticated: true,
          accessKey: undefined,
        })
      );

      // Verify that captcha was accepted
      if (!session.allowedToRequestCode) {
        throw new Error('requestVerification: Not allowed to send code');
      }

      // Request an SMS or Voice confirmation
      session = verificationSessionZod.parse(
        await _ajax({
          call: 'verificationSession',
          httpType: 'POST',
          urlParameters: `/${encodeURIComponent(session.id)}/code`,
          responseType: 'json',
          jsonData: {
            client: 'ios',
            transport:
              transport === VerificationTransport.SMS ? 'sms' : 'voice',
          },
          unauthenticated: true,
          accessKey: undefined,
        })
      );

      // Return sessionId to be used in `createAccount`
      return { sessionId: session.id };
    }

    async function checkAccountExistence(serviceId: ServiceIdString) {
      try {
        await _ajax({
          httpType: 'HEAD',
          call: 'accountExistence',
          urlParameters: `/${serviceId}`,
          unauthenticated: true,
          accessKey: undefined,
        });
        return true;
      } catch (error) {
        if (error instanceof HTTPError && error.code === 404) {
          return false;
        }

        throw error;
      }
    }

    function startRegistration() {
      strictAssert(
        activeRegistration === undefined,
        'Registration already in progress'
      );

      activeRegistration = explodePromise<void>();
      log.info('WebAPI: starting registration');

      return activeRegistration;
    }

    function finishRegistration(registration: unknown) {
      strictAssert(activeRegistration !== undefined, 'No active registration');
      strictAssert(
        activeRegistration === registration,
        'Invalid registration baton'
      );

      log.info('WebAPI: finishing registration');
      const current = activeRegistration;
      activeRegistration = undefined;
      current.resolve();
    }

    async function _withNewCredentials<
      Result extends { uuid: AciString; deviceId?: number }
    >(
      { username: newUsername, password: newPassword }: WebAPICredentials,
      callback: () => Promise<Result>
    ): Promise<Result> {
      // Reset old websocket credentials and disconnect.
      // AccountManager is our only caller and it will trigger
      // `registration_done` which will update credentials.
      await logout();

      // Update REST credentials, though. We need them for the call below
      username = newUsername;
      password = newPassword;

      const result = await callback();

      const { uuid: aci = newUsername, deviceId = 1 } = result;

      // Set final REST credentials to let `registerKeys` succeed.
      username = `${aci}.${deviceId}`;
      password = newPassword;

      return result;
    }

    async function createAccount({
      sessionId,
      number,
      code,
      newPassword,
      registrationId,
      pniRegistrationId,
      accessKey,
      aciPublicKey,
      pniPublicKey,
      aciSignedPreKey,
      pniSignedPreKey,
      aciPqLastResortPreKey,
      pniPqLastResortPreKey,
    }: CreateAccountOptionsType) {
      const session = verificationSessionZod.parse(
        await _ajax({
          isRegistration: true,
          call: 'verificationSession',
          httpType: 'PUT',
          urlParameters: `/${encodeURIComponent(sessionId)}/code`,
          responseType: 'json',
          jsonData: {
            code,
          },
          unauthenticated: true,
          accessKey: undefined,
        })
      );

      if (!session.verified) {
        throw new Error('createAccount: invalid code');
      }

      const capabilities: CapabilitiesUploadType = {
        deleteSync: true,
      };

      const jsonData = {
        sessionId: session.id,
        accountAttributes: {
          fetchesMessages: true,
          registrationId,
          pniRegistrationId,
          capabilities,
          unidentifiedAccessKey: toBase64(accessKey),
        },
        requireAtomic: true,
        skipDeviceTransfer: true,
        aciIdentityKey: toBase64(aciPublicKey),
        pniIdentityKey: toBase64(pniPublicKey),
        aciSignedPreKey: serializeSignedPreKey(aciSignedPreKey),
        pniSignedPreKey: serializeSignedPreKey(pniSignedPreKey),
        aciPqLastResortPreKey: serializeSignedPreKey(aciPqLastResortPreKey),
        pniPqLastResortPreKey: serializeSignedPreKey(pniPqLastResortPreKey),
      };

      return _withNewCredentials(
        {
          username: number,
          password: newPassword,
        },
        async () => {
          const responseJson = await _ajax({
            isRegistration: true,
            call: 'registration',
            httpType: 'POST',
            responseType: 'json',
            jsonData,
          });

          return createAccountResultZod.parse(responseJson);
        }
      );
    }

    async function linkDevice({
      number,
      verificationCode,
      encryptedDeviceName,
      newPassword,
      registrationId,
      pniRegistrationId,
      aciSignedPreKey,
      pniSignedPreKey,
      aciPqLastResortPreKey,
      pniPqLastResortPreKey,
    }: LinkDeviceOptionsType) {
      const capabilities: CapabilitiesUploadType = {
        deleteSync: true,
      };

      const jsonData = {
        verificationCode,
        accountAttributes: {
          fetchesMessages: true,
          name: encryptedDeviceName,
          registrationId,
          pniRegistrationId,
          capabilities,
        },
        aciSignedPreKey: serializeSignedPreKey(aciSignedPreKey),
        pniSignedPreKey: serializeSignedPreKey(pniSignedPreKey),
        aciPqLastResortPreKey: serializeSignedPreKey(aciPqLastResortPreKey),
        pniPqLastResortPreKey: serializeSignedPreKey(pniPqLastResortPreKey),
      };
      return _withNewCredentials(
        {
          username: number,
          password: newPassword,
        },
        async () => {
          const responseJson = await _ajax({
            isRegistration: true,
            call: 'linkDevice',
            httpType: 'PUT',
            responseType: 'json',
            jsonData,
          });

          return linkDeviceResultZod.parse(responseJson);
        }
      );
    }

    async function updateDeviceName(deviceName: string) {
      await _ajax({
        call: 'updateDeviceName',
        httpType: 'PUT',
        jsonData: {
          deviceName,
        },
      });
    }

    async function getIceServers() {
      return (await _ajax({
        call: 'getIceServers',
        httpType: 'GET',
        responseType: 'json',
      })) as GetIceServersResultType;
    }

    type JSONSignedPreKeyType = {
      keyId: number;
      publicKey: string;
      signature: string;
    };
    type JSONPreKeyType = {
      keyId: number;
      publicKey: string;
    };
    type JSONKyberPreKeyType = {
      keyId: number;
      publicKey: string;
      signature: string;
    };

    type JSONKeysType = {
      preKeys?: Array<JSONPreKeyType>;
      pqPreKeys?: Array<JSONKyberPreKeyType>;
      pqLastResortPreKey?: JSONKyberPreKeyType;
      signedPreKey?: JSONSignedPreKeyType;
    };

    async function registerKeys(
      genKeys: UploadKeysType,
      serviceIdKind: ServiceIdKind
    ) {
      const preKeys = genKeys.preKeys?.map(key => ({
        keyId: key.keyId,
        publicKey: toBase64(key.publicKey),
      }));
      const pqPreKeys = genKeys.pqPreKeys?.map(key => ({
        keyId: key.keyId,
        publicKey: toBase64(key.publicKey),
        signature: toBase64(key.signature),
      }));

      if (
        !preKeys?.length &&
        !pqPreKeys?.length &&
        !genKeys.pqLastResortPreKey &&
        !genKeys.signedPreKey
      ) {
        throw new Error(
          'registerKeys: None of the four potential key types were provided!'
        );
      }
      if (preKeys && preKeys.length === 0) {
        throw new Error('registerKeys: Attempting to upload zero preKeys!');
      }
      if (pqPreKeys && pqPreKeys.length === 0) {
        throw new Error('registerKeys: Attempting to upload zero pqPreKeys!');
      }

      const keys: JSONKeysType = {
        preKeys,
        pqPreKeys,
        pqLastResortPreKey: serializeSignedPreKey(genKeys.pqLastResortPreKey),
        signedPreKey: serializeSignedPreKey(genKeys.signedPreKey),
      };

      await _ajax({
        isRegistration: true,
        call: 'keys',
        urlParameters: `?${serviceIdKindToQuery(serviceIdKind)}`,
        httpType: 'PUT',
        jsonData: keys,
      });
    }

    async function getBackupInfo(headers: BackupPresentationHeadersType) {
      const res = await _ajax({
        call: 'backup',
        httpType: 'GET',
        unauthenticated: true,
        accessKey: undefined,
        headers,
        responseType: 'json',
      });

      return getBackupInfoResponseSchema.parse(res);
    }

    async function getBackupMediaUploadForm(
      headers: BackupPresentationHeadersType
    ) {
      const res = await _ajax({
        call: 'getBackupMediaUploadForm',
        httpType: 'GET',
        unauthenticated: true,
        accessKey: undefined,
        headers,
        responseType: 'json',
      });

      return attachmentUploadFormResponse.parse(res);
    }

    function createFetchForAttachmentUpload({
      signedUploadLocation,
      headers: uploadHeaders,
      cdn,
    }: AttachmentUploadFormResponseType): FetchFunctionType {
      strictAssert(cdn === 3, 'Fetch can only be created for CDN 3');
      const { origin: expectedOrigin } = new URL(signedUploadLocation);

      return async (
        endpoint: string | URL,
        init: RequestInit
      ): Promise<Response> => {
        const { origin } = new URL(endpoint);
        strictAssert(origin === expectedOrigin, `Unexpected origin: ${origin}`);

        const fetchOptions = await getFetchOptions({
          // Will be overriden
          type: 'GET',

          certificateAuthority,
          proxyUrl,
          timeout: 0,
          version,

          headers: uploadHeaders,
        });

        return fetch(endpoint, {
          ...fetchOptions,
          ...init,
          headers: {
            ...fetchOptions.headers,
            ...init.headers,
          },
        });
      };
    }

    async function getBackupUploadForm(headers: BackupPresentationHeadersType) {
      const res = await _ajax({
        call: 'getBackupUploadForm',
        httpType: 'GET',
        unauthenticated: true,
        accessKey: undefined,
        headers,
        responseType: 'json',
      });

      return attachmentUploadFormResponse.parse(res);
    }

    async function refreshBackup(headers: BackupPresentationHeadersType) {
      await _ajax({
        call: 'backup',
        httpType: 'POST',
        unauthenticated: true,
        accessKey: undefined,
        headers,
      });
    }

    async function getBackupCredentials({
      startDayInMs,
      endDayInMs,
    }: GetBackupCredentialsOptionsType) {
      const startDayInSeconds = startDayInMs / durations.SECOND;
      const endDayInSeconds = endDayInMs / durations.SECOND;
      const res = await _ajax({
        call: 'getBackupCredentials',
        httpType: 'GET',
        urlParameters:
          `?redemptionStartSeconds=${startDayInSeconds}&` +
          `redemptionEndSeconds=${endDayInSeconds}`,
        responseType: 'json',
      });

      return getBackupCredentialsResponseSchema.parse(res);
    }

    async function getBackupCDNCredentials({
      headers,
      cdn,
    }: GetBackupCDNCredentialsOptionsType) {
      const res = await _ajax({
        call: 'getBackupCDNCredentials',
        httpType: 'GET',
        unauthenticated: true,
        accessKey: undefined,
        headers,
        urlParameters: `?cdn=${cdn}`,
        responseType: 'json',
      });

      return getBackupCDNCredentialsResponseSchema.parse(res);
    }

    async function setBackupId({
      backupAuthCredentialRequest,
    }: SetBackupIdOptionsType) {
      await _ajax({
        call: 'setBackupId',
        httpType: 'PUT',
        jsonData: {
          backupAuthCredentialRequest: toBase64(
            backupAuthCredentialRequest
          ),
        },
      });
    }

    async function setBackupSignatureKey({
      headers,
      backupIdPublicKey,
    }: SetBackupSignatureKeyOptionsType) {
      await _ajax({
        call: 'setBackupSignatureKey',
        httpType: 'PUT',
        unauthenticated: true,
        accessKey: undefined,
        headers,
        jsonData: {
          backupIdPublicKey: toBase64(backupIdPublicKey),
        },
      });
    }

    async function backupMediaBatch({
      headers,
      items,
    }: BackupMediaBatchOptionsType) {
      const res = await _ajax({
        call: 'backupMediaBatch',
        httpType: 'PUT',
        unauthenticated: true,
        accessKey: undefined,
        headers,
        responseType: 'json',
        jsonData: {
          items: items.map(item => {
            const {
              sourceAttachment,
              objectLength,
              mediaId,
              hmacKey,
              encryptionKey,
              iv,
            } = item;

            return {
              sourceAttachment: {
                cdn: sourceAttachment.cdn,
                key: sourceAttachment.key,
              },
              objectLength,
              mediaId,
              hmacKey: toBase64(hmacKey),
              encryptionKey: toBase64(encryptionKey),
              iv: toBase64(iv),
            };
          }),
        },
      });

      return backupMediaBatchResponseSchema.parse(res);
    }

    async function backupDeleteMedia({
      headers,
      mediaToDelete,
    }: BackupDeleteMediaOptionsType) {
      await _ajax({
        call: 'backupMediaDelete',
        httpType: 'POST',
        unauthenticated: true,
        accessKey: undefined,
        headers,
        jsonData: {
          mediaToDelete: mediaToDelete.map(({ cdn, mediaId }) => {
            return {
              cdn,
              mediaId,
            };
          }),
        },
      });
    }

    async function backupListMedia({
      headers,
      cursor,
      limit,
    }: BackupListMediaOptionsType) {
      const params = new Array<string>();

      if (cursor != null) {
        params.push(`cursor=${encodeURIComponent(cursor)}`);
      }
      params.push(`limit=${limit}`);

      const res = await _ajax({
        call: 'backupMedia',
        httpType: 'GET',
        unauthenticated: true,
        accessKey: undefined,
        headers,
        responseType: 'json',
        urlParameters: `?${params.join('&')}`,
      });

      return backupListMediaResponseSchema.parse(res);
    }

    async function callLinkCreateAuth(
      requestBase64: string
    ): Promise<CallLinkCreateAuthResponseType> {
      const response = await _ajax({
        call: 'callLinkCreateAuth',
        httpType: 'POST',
        responseType: 'json',
        jsonData: { createCallLinkCredentialRequest: requestBase64 },
      });
      return callLinkCreateAuthResponseSchema.parse(response);
    }

    async function setPhoneNumberDiscoverability(newValue: boolean) {
      await _ajax({
        call: 'phoneNumberDiscoverability',
        httpType: 'PUT',
        jsonData: {
          discoverableByPhoneNumber: newValue,
        },
      });
    }

    async function getMyKeyCounts(
      serviceIdKind: ServiceIdKind
    ): Promise<ServerKeyCountType> {
      const result = (await _ajax({
        call: 'keys',
        urlParameters: `?${serviceIdKindToQuery(serviceIdKind)}`,
        httpType: 'GET',
        responseType: 'json',
        validateResponse: { count: 'number', pqCount: 'number' },
      })) as ServerKeyCountType;

      return result;
    }

    type ServerKeyResponseType = {
      devices: Array<{
        deviceId: number;
        registrationId: number;

        // We'll get a 404 if none of these keys are provided; we'll have at least one
        preKey?: {
          keyId: number;
          publicKey: string;
        };
        signedPreKey?: {
          keyId: number;
          publicKey: string;
          signature: string;
        };
        pqPreKey?: {
          keyId: number;
          publicKey: string;
          signature: string;
        };
      }>;
      identityKey: string;
    };

    function handleKeys(res: ServerKeyResponseType): ServerKeysType {
      if (!Array.isArray(res.devices)) {
        throw new Error('Invalid response');
      }

      const devices = res.devices.map(device => {
        if (
          !_validateResponse(device, { signedPreKey: 'object' }) ||
          !_validateResponse(device.signedPreKey, {
            publicKey: 'string',
            signature: 'string',
          })
        ) {
          throw new Error('Invalid signedPreKey');
        }

        let preKey;
        if (device.preKey) {
          if (
            !_validateResponse(device, { preKey: 'object' }) ||
            !_validateResponse(device.preKey, { publicKey: 'string' })
          ) {
            throw new Error('Invalid preKey');
          }

          preKey = {
            keyId: device.preKey.keyId,
            publicKey: fromBase64(device.preKey.publicKey),
          };
        }

        return {
          deviceId: device.deviceId,
          registrationId: device.registrationId,
          ...(preKey ? { preKey } : null),
          ...(device.signedPreKey
            ? {
              signedPreKey: {
                keyId: device.signedPreKey.keyId,
                publicKey: fromBase64(device.signedPreKey.publicKey),
                signature: fromBase64(device.signedPreKey.signature),
              },
            }
            : null),
          ...(device.pqPreKey
            ? {
              pqPreKey: {
                keyId: device.pqPreKey.keyId,
                publicKey: fromBase64(device.pqPreKey.publicKey),
                signature: fromBase64(device.pqPreKey.signature),
              },
            }
            : null),
        };
      });

      return {
        devices,
        identityKey: fromBase64(res.identityKey),
      };
    }

    async function getKeysForServiceId(
      serviceId: ServiceIdString,
      deviceId?: number
    ) {
      const keys = (await _ajax({
        call: 'keys',
        httpType: 'GET',
        urlParameters: `/${serviceId}/${deviceId || '*'}`,
        responseType: 'json',
        validateResponse: { identityKey: 'string', devices: 'object' },
      })) as ServerKeyResponseType;
      return handleKeys(keys);
    }

    async function getKeysForServiceIdUnauth(
      serviceId: ServiceIdString,
      deviceId?: number,
      { accessKey }: { accessKey?: string } = {}
    ) {
      const keys = (await _ajax({
        call: 'keys',
        httpType: 'GET',
        urlParameters: `/${serviceId}/${deviceId || '*'}`,
        responseType: 'json',
        validateResponse: { identityKey: 'string', devices: 'object' },
        unauthenticated: true,
        accessKey,
      })) as ServerKeyResponseType;
      return handleKeys(keys);
    }

    async function sendMessagesUnauth(
      destination: ServiceIdString,
      messages: ReadonlyArray<MessageType>,
      timestamp: number,
      {
        accessKey,
        online,
        urgent = true,
        story = false,
      }: {
        accessKey?: string;
        online?: boolean;
        story?: boolean;
        urgent?: boolean;
      }
    ) {
      const jsonData = {
        messages,
        timestamp,
        online: Boolean(online),
        urgent,
      };

      await _ajax({
        call: 'messages',
        httpType: 'PUT',
        urlParameters: `/${destination}?story=${booleanToString(story)}`,
        jsonData,
        responseType: 'json',
        unauthenticated: true,
        accessKey,
      });
    }

    async function sendMessages(
      destination: ServiceIdString,
      messages: ReadonlyArray<MessageType>,
      timestamp: number,
      {
        online,
        urgent = true,
        story = false,
      }: { online?: boolean; story?: boolean; urgent?: boolean }
    ) {
      const jsonData = {
        messages,
        timestamp,
        online: Boolean(online),
        urgent,
      };

      await _ajax({
        call: 'messages',
        httpType: 'PUT',
        urlParameters: `/${destination}?story=${booleanToString(story)}`,
        jsonData,
        responseType: 'json',
      });
    }

    function booleanToString(value: boolean | undefined): string {
      return value ? 'true' : 'false';
    }

    async function sendWithSenderKey(
      data: Uint8Array,
      accessKeys: Uint8Array,
      timestamp: number,
      {
        online,
        urgent = true,
        story = false,
      }: {
        online?: boolean;
        story?: boolean;
        urgent?: boolean;
      }
    ): Promise<MultiRecipient200ResponseType> {
      const onlineParam = `&online=${booleanToString(online)}`;
      const urgentParam = `&urgent=${booleanToString(urgent)}`;
      const storyParam = `&story=${booleanToString(story)}`;

      const response = await _ajax({
        call: 'multiRecipient',
        httpType: 'PUT',
        contentType: 'application/vnd.signal-messenger.mrm',
        data,
        urlParameters: `?ts=${timestamp}${onlineParam}${urgentParam}${storyParam}`,
        responseType: 'json',
        unauthenticated: true,
        accessKey: toBase64(accessKeys),
      });
      const parseResult = multiRecipient200ResponseSchema.safeParse(response);
      if (parseResult.success) {
        return parseResult.data;
      }

      log.warn(
        'WebAPI: invalid response from sendWithSenderKey',
        toLogFormat(parseResult.error)
      );
      return response as MultiRecipient200ResponseType;
    }

    function redactStickerUrl(stickerUrl: string) {
      return stickerUrl.replace(
        /(\/stickers\/)([^/]+)(\/)/,
        (_, begin: string, packId: string, end: string) =>
          `${begin}${redactPackId(packId)}${end}`
      );
    }

    async function getSticker(packId: string, stickerId: number) {
      if (!isPackIdValid(packId)) {
        throw new Error('getSticker: pack ID was invalid');
      }
      return _outerAjax(
        `${cdnUrlObject['0']}/stickers/${packId}/full/${stickerId}`,
        {
          certificateAuthority,
          proxyUrl,
          responseType: 'bytes',
          type: 'GET',
          redactUrl: redactStickerUrl,
          version,
        }
      );
    }

    async function getStickerPackManifest(packId: string) {
      if (!isPackIdValid(packId)) {
        throw new Error('getStickerPackManifest: pack ID was invalid');
      }
      return _outerAjax(
        `${cdnUrlObject['0']}/stickers/${packId}/manifest.proto`,
        {
          certificateAuthority,
          proxyUrl,
          responseType: 'bytes',
          type: 'GET',
          redactUrl: redactStickerUrl,
          version,
        }
      );
    }

    type ServerV2AttachmentType = {
      key: string;
      credential: string;
      acl: string;
      algorithm: string;
      date: string;
      policy: string;
      signature: string;
    };

    function makePutParams(
      {
        key,
        credential,
        acl,
        algorithm,
        date,
        policy,
        signature,
      }: ServerV2AttachmentType,
      encryptedBin: Uint8Array
    ) {
      // Note: when using the boundary string in the POST body, it needs to be prefixed by
      //   an extra --, and the final boundary string at the end gets a -- prefix and a --
      //   suffix.
      const boundaryString = `----------------${getGuid().replace(/-/g, '')}`;
      const CRLF = '\r\n';
      const getSection = (name: string, value: string) =>
        [
          `--${boundaryString}`,
          `Content-Disposition: form-data; name="${name}"${CRLF}`,
          value,
        ].join(CRLF);

      const start = [
        getSection('key', key),
        getSection('x-amz-credential', credential),
        getSection('acl', acl),
        getSection('x-amz-algorithm', algorithm),
        getSection('x-amz-date', date),
        getSection('policy', policy),
        getSection('x-amz-signature', signature),
        getSection('Content-Type', 'application/octet-stream'),
        `--${boundaryString}`,
        'Content-Disposition: form-data; name="file"',
        `Content-Type: application/octet-stream${CRLF}${CRLF}`,
      ].join(CRLF);
      const end = `${CRLF}--${boundaryString}--${CRLF}`;

      const startBuffer = Buffer.from(start, 'utf8');
      const attachmentBuffer = Buffer.from(encryptedBin);
      const endBuffer = Buffer.from(end, 'utf8');

      const contentLength =
        startBuffer.length + attachmentBuffer.length + endBuffer.length;
      const data = Buffer.concat(
        [startBuffer, attachmentBuffer, endBuffer],
        contentLength
      );

      return {
        data,
        contentType: `multipart/form-data; boundary=${boundaryString}`,
        headers: {
          'Content-Length': contentLength.toString(),
        },
      };
    }

    async function putStickers(
      encryptedManifest: Uint8Array,
      encryptedStickers: ReadonlyArray<Uint8Array>,
      onProgress?: () => void
    ) {
      // Get manifest and sticker upload parameters
      const formJson = await _ajax({
        call: 'getStickerPackUpload',
        responseType: 'json',
        httpType: 'GET',
        urlParameters: `/${encryptedStickers.length}`,
      });

      const { packId, manifest, stickers } =
        StickerPackUploadFormSchema.parse(formJson);

      // Upload manifest
      const manifestParams = makePutParams(manifest, encryptedManifest);
      // This is going to the CDN, not the service, so we use _outerAjax
      await _outerAjax(`${cdnUrlObject['0']}/`, {
        ...manifestParams,
        certificateAuthority,
        proxyUrl,
        timeout: 0,
        type: 'POST',
        version,
      });

      // Upload stickers
      const queue = new PQueue({
        concurrency: 3,
        timeout: durations.MINUTE * 30,
        throwOnTimeout: true,
      });
      await Promise.all(
        stickers.map(async (sticker: ServerV2AttachmentType, index: number) => {
          const stickerParams = makePutParams(
            sticker,
            encryptedStickers[index]
          );
          await queue.add(async () =>
            _outerAjax(`${cdnUrlObject['0']}/`, {
              ...stickerParams,
              certificateAuthority,
              proxyUrl,
              timeout: 0,
              type: 'POST',
              version,
            })
          );
          if (onProgress) {
            onProgress();
          }
        })
      );

      // Done!
      return packId;
    }

    // Transit tier is the default place for normal (non-backup) attachments.
    // Called "transit" because it is transitory
    async function getAttachment({
      cdnKey,
      cdnNumber,
      options,
    }: {
      cdnKey: string;
      cdnNumber?: number;
      options?: {
        disableRetries?: boolean;
        timeout?: number;
      };
    }) {
      return _getAttachment({
        cdnPath: `/attachments/${cdnKey}`,
        cdnNumber: cdnNumber ?? 0,
        redactor: _createRedactor(cdnKey),
        options,
      });
    }

    async function getAttachmentFromBackupTier({
      mediaId,
      backupDir,
      mediaDir,
      cdnNumber,
      headers,
      options,
    }: {
      mediaId: string;
      backupDir: string;
      mediaDir: string;
      cdnNumber: number;
      headers: Record<string, string>;
      options?: {
        disableRetries?: boolean;
        timeout?: number;
      };
    }) {
      return _getAttachment({
        cdnPath: `/backups/${backupDir}/${mediaDir}/${mediaId}`,
        cdnNumber,
        headers,
        redactor: _createRedactor(backupDir, mediaDir, mediaId),
        options,
      });
    }

    async function _getAttachment({
      cdnPath,
      cdnNumber,
      headers,
      redactor,
      options,
    }: {
      cdnPath: string;
      cdnNumber: number;
      headers?: Record<string, string>;
      redactor: RedactUrl;
      options?: {
        disableRetries?: boolean;
        timeout?: number;
      };
    }): Promise<Readable> {
      const abortController = new AbortController();
      const cdnUrl = cdnUrlObject[cdnNumber] ?? cdnUrlObject['0'];
      // This is going to the CDN, not the service, so we use _outerAjax
      const downloadStream = await _outerAjax(`${cdnUrl}${cdnPath}`, {
        headers,
        certificateAuthority,
        disableRetries: options?.disableRetries,
        proxyUrl,
        responseType: 'stream',
        timeout: options?.timeout || 0,
        type: 'GET',
        redactUrl: redactor,
        version,
        abortSignal: abortController.signal,
      });

      const timeoutStream = getTimeoutStream({
        name: `getAttachment(${redactor(cdnPath)})`,
        timeout: GET_ATTACHMENT_CHUNK_TIMEOUT,
        abortController,
      });

      const combinedStream = downloadStream
        // We do this manually; pipe() doesn't flow errors through the streams for us
        .on('error', (error: Error) => {
          timeoutStream.emit('error', error);
        })
        .pipe(timeoutStream);

      const cancelRequest = (error: Error) => {
        combinedStream.emit('error', error);
        abortController.abort();
      };
      registerInflightRequest(cancelRequest);

      combinedStream.on('done', () => {
        unregisterInFlightRequest(cancelRequest);
      });

      return combinedStream;
    }

    async function getAttachmentUploadForm() {
      return attachmentUploadFormResponse.parse(
        await _ajax({
          call: 'attachmentUploadForm',
          httpType: 'GET',
          responseType: 'json',
        })
      );
    }

    async function putEncryptedAttachment(
      encryptedBin: (start: number, end?: number) => Readable,
      encryptedSize: number,
      uploadForm: AttachmentUploadFormResponseType
    ) {
      const { signedUploadLocation, headers } = uploadForm;

      // This is going to the CDN, not the service, so we use _outerAjax
      const { response: uploadResponse } = await _outerAjax(
        signedUploadLocation,
        {
          responseType: 'byteswithdetails',
          certificateAuthority,
          proxyUrl,
          timeout: 0,
          type: 'POST',
          version,
          headers,
          redactUrl: () => {
            const tmp = new URL(signedUploadLocation);
            tmp.search = '';
            tmp.pathname = '';
            return `${tmp}[REDACTED]`;
          },
        }
      );

      const uploadLocation = uploadResponse.headers.get('location');
      strictAssert(
        uploadLocation,
        'attachment upload form header has no location'
      );

      const redactUrl = () => {
        const tmp = new URL(uploadLocation);
        tmp.search = '';
        tmp.pathname = '';
        return `${tmp}[REDACTED]`;
      };

      const MAX_RETRIES = 10;
      for (
        let start = 0, retries = 0;
        start < encryptedSize && retries < MAX_RETRIES;
        retries += 1
      ) {
        const logId = `putEncryptedAttachment(attempt=${retries})`;

        if (retries !== 0) {
          log.warn(`${logId}: resuming from ${start}`);
        }

        try {
          // This is going to the CDN, not the service, so we use _outerAjax
          // eslint-disable-next-line no-await-in-loop
          await _outerAjax(uploadLocation, {
            disableRetries: true,
            certificateAuthority,
            proxyUrl,
            timeout: 0,
            type: 'PUT',
            version,
            headers: {
              'Content-Range': `bytes ${start}-*/${encryptedSize}`,
            },
            data: () => encryptedBin(start),
            redactUrl,
          });

          if (retries !== 0) {
            log.warn(`${logId}: Attachment upload succeeded`);
          }
          return;
        } catch (error) {
          log.warn(
            `${logId}: Failed to upload attachment chunk: ${toLogFormat(error)}`
          );
        }

        // eslint-disable-next-line no-await-in-loop
        const result: BytesWithDetailsType = await _outerAjax(uploadLocation, {
          certificateAuthority,
          proxyUrl,
          type: 'PUT',
          version,
          headers: {
            'Content-Range': `bytes */${encryptedSize}`,
          },
          data: new Uint8Array(0),
          redactUrl,
          responseType: 'byteswithdetails',
        });
        const { response } = result;
        strictAssert(response.status === 308, 'Invalid server response');
        const range = response.headers.get('range');
        if (range != null) {
          const match = range.match(/^bytes=0-(\d+)$/);
          strictAssert(match != null, `Invalid range header: ${range}`);
          start = parseInt(match[1], 10);
        } else {
          log.warn(`${logId}: No range header`);
        }
      }

      throw new Error('Upload failed');
    }

    function getHeaderPadding() {
      const max = randomInt(1, 64);
      let characters = '';

      for (let i = 0; i < max; i += 1) {
        characters += String.fromCharCode(randomInt(65, 122));
      }

      return characters;
    }

    async function fetchLinkPreviewMetadata(
      href: string,
      abortSignal: AbortSignal
    ) {
      return linkPreviewFetch.fetchLinkPreviewMetadata(
        fetchForLinkPreviews,
        href,
        abortSignal
      );
    }

    async function fetchLinkPreviewImage(
      href: string,
      abortSignal: AbortSignal
    ) {
      return linkPreviewFetch.fetchLinkPreviewImage(
        fetchForLinkPreviews,
        href,
        abortSignal
      );
    }

    async function makeProxiedRequest(
      targetUrl: string,
      options: ProxiedRequestOptionsType = {}
    ): Promise<MakeProxiedRequestResultType> {
      const { returnUint8Array, start, end } = options;
      const headers: HeaderListType = {
        'X-SignalPadding': getHeaderPadding(),
      };

      if (isNumber(start) && isNumber(end)) {
        headers.Range = `bytes=${start}-${end}`;
      }

      const result = await _outerAjax(targetUrl, {
        responseType: returnUint8Array ? 'byteswithdetails' : undefined,
        proxyUrl: contentProxyUrl,
        type: 'GET',
        redirect: 'follow',
        redactUrl: () => '[REDACTED_URL]',
        headers,
        version,
      });

      if (!returnUint8Array) {
        return result as Uint8Array;
      }

      const { response } = result as BytesWithDetailsType;
      if (!response.headers || !response.headers.get) {
        throw new Error('makeProxiedRequest: Problem retrieving header value');
      }

      const range = response.headers.get('content-range');
      const match = PARSE_RANGE_HEADER.exec(range || '');

      if (!match || !match[1]) {
        throw new Error(
          `makeProxiedRequest: Unable to parse total size from ${range}`
        );
      }

      const totalSize = parseInt(match[1], 10);

      return {
        totalSize,
        result: result as BytesWithDetailsType,
      };
    }

    async function makeSfuRequest(
      targetUrl: string,
      type: HTTPCodeType,
      headers: HeaderListType,
      body: Uint8Array | undefined
    ): Promise<BytesWithDetailsType> {
      return _outerAjax(targetUrl, {
        certificateAuthority,
        data: body,
        headers,
        proxyUrl,
        responseType: 'byteswithdetails',
        timeout: 0,
        type,
        version,
      });
    }

    // Groups

    function generateGroupAuth(
      groupPublicParamsHex: string,
      authCredentialPresentationHex: string
    ) {
      return toBase64(
        Buffer.from(`${groupPublicParamsHex}:${authCredentialPresentationHex}`)
      );
    }

    async function getGroupCredentials({
      startDayInMs,
      endDayInMs,
    }: GetGroupCredentialsOptionsType): Promise<GetGroupCredentialsResultType> {
      const startDayInSeconds = startDayInMs / durations.SECOND;
      const endDayInSeconds = endDayInMs / durations.SECOND;
      const response = (await _ajax({
        call: 'getGroupCredentials',
        urlParameters:
          `?redemptionStartSeconds=${startDayInSeconds}&` +
          `redemptionEndSeconds=${endDayInSeconds}&` +
          'zkcCredential=true',
        httpType: 'GET',
        responseType: 'json',
      })) as GetGroupCredentialsResultType;

      return response;
    }

    async function getExternalGroupCredential(
      options: GroupCredentialsType
    ): Promise<Proto.IExternalGroupCredential> {
      const basicAuth = generateGroupAuth(
        options.groupPublicParamsHex,
        options.authCredentialPresentationHex
      );

      const response = await _ajax({
        basicAuth,
        call: 'groupToken',
        httpType: 'GET',
        contentType: 'application/x-protobuf',
        responseType: 'bytes',
        host: storageUrl,
        disableSessionResumption: true,
      });

      return Proto.ExternalGroupCredential.decode(response);
    }

    function verifyAttributes(attributes: Proto.IAvatarUploadAttributes) {
      const { key, credential, acl, algorithm, date, policy, signature } =
        attributes;

      if (
        !key ||
        !credential ||
        !acl ||
        !algorithm ||
        !date ||
        !policy ||
        !signature
      ) {
        throw new Error(
          'verifyAttributes: Missing value from AvatarUploadAttributes'
        );
      }

      return {
        key,
        credential,
        acl,
        algorithm,
        date,
        policy,
        signature,
      };
    }

    async function uploadAvatar(
      uploadAvatarRequestHeaders: UploadAvatarHeadersType,
      avatarData: Uint8Array
    ): Promise<string> {
      const verified = verifyAttributes(uploadAvatarRequestHeaders);
      const { key } = verified;

      const manifestParams = makePutParams(verified, avatarData);

      await _outerAjax(`${cdnUrlObject['0']}/`, {
        ...manifestParams,
        certificateAuthority,
        proxyUrl,
        timeout: 0,
        type: 'POST',
        version,
      });

      return key;
    }

    async function uploadGroupAvatar(
      avatarData: Uint8Array,
      options: GroupCredentialsType
    ): Promise<string> {
      const basicAuth = generateGroupAuth(
        options.groupPublicParamsHex,
        options.authCredentialPresentationHex
      );

      const response = await _ajax({
        basicAuth,
        call: 'getGroupAvatarUpload',
        httpType: 'GET',
        responseType: 'bytes',
        host: storageUrl,
        disableSessionResumption: true,
      });
      const attributes = Proto.AvatarUploadAttributes.decode(response);

      const verified = verifyAttributes(attributes);
      const { key } = verified;

      const manifestParams = makePutParams(verified, avatarData);

      await _outerAjax(`${cdnUrlObject['0']}/`, {
        ...manifestParams,
        certificateAuthority,
        proxyUrl,
        timeout: 0,
        type: 'POST',
        version,
      });

      return key;
    }

    async function getGroupAvatar(key: string): Promise<Uint8Array> {
      return _outerAjax(`${cdnUrlObject['0']}/${key}`, {
        certificateAuthority,
        proxyUrl,
        responseType: 'bytes',
        timeout: 0,
        type: 'GET',
        version,
        redactUrl: _createRedactor(key),
      });
    }

    async function createGroup(
      group: Proto.IGroup,
      options: GroupCredentialsType
    ): Promise<Proto.IGroupResponse> {
      const basicAuth = generateGroupAuth(
        options.groupPublicParamsHex,
        options.authCredentialPresentationHex
      );
      const data = Proto.Group.encode(group).finish();

      const response = await _ajax({
        basicAuth,
        call: 'groups',
        contentType: 'application/x-protobuf',
        data,
        host: storageUrl,
        disableSessionResumption: true,
        httpType: 'PUT',
        responseType: 'bytes',
      });

      return Proto.GroupResponse.decode(response);
    }

    async function getGroup(
      options: GroupCredentialsType
    ): Promise<Proto.IGroupResponse> {
      const basicAuth = generateGroupAuth(
        options.groupPublicParamsHex,
        options.authCredentialPresentationHex
      );

      const response = await _ajax({
        basicAuth,
        call: 'groups',
        contentType: 'application/x-protobuf',
        host: storageUrl,
        disableSessionResumption: true,
        httpType: 'GET',
        responseType: 'bytes',
      });

      return Proto.GroupResponse.decode(response);
    }

    async function getGroupFromLink(
      inviteLinkPassword: string | undefined,
      auth: GroupCredentialsType
    ): Promise<Proto.GroupJoinInfo> {
      const basicAuth = generateGroupAuth(
        auth.groupPublicParamsHex,
        auth.authCredentialPresentationHex
      );
      const safeInviteLinkPassword = inviteLinkPassword
        ? toWebSafeBase64(inviteLinkPassword)
        : undefined;

      const response = await _ajax({
        basicAuth,
        call: 'groupsViaLink',
        contentType: 'application/x-protobuf',
        host: storageUrl,
        disableSessionResumption: true,
        httpType: 'GET',
        responseType: 'bytes',
        urlParameters: safeInviteLinkPassword
          ? `${safeInviteLinkPassword}`
          : undefined,
        redactUrl: _createRedactor(safeInviteLinkPassword),
      });

      return Proto.GroupJoinInfo.decode(response);
    }

    async function modifyGroup(
      changes: Proto.GroupChange.IActions,
      options: GroupCredentialsType,
      inviteLinkBase64?: string
    ): Promise<Proto.IGroupChangeResponse> {
      const basicAuth = generateGroupAuth(
        options.groupPublicParamsHex,
        options.authCredentialPresentationHex
      );
      const data = Proto.GroupChange.Actions.encode(changes).finish();
      const safeInviteLinkPassword = inviteLinkBase64
        ? toWebSafeBase64(inviteLinkBase64)
        : undefined;

      const response = await _ajax({
        basicAuth,
        call: 'groups',
        contentType: 'application/x-protobuf',
        data,
        host: storageUrl,
        disableSessionResumption: true,
        httpType: 'PATCH',
        responseType: 'bytes',
        urlParameters: safeInviteLinkPassword
          ? `?inviteLinkPassword=${safeInviteLinkPassword}`
          : undefined,
        redactUrl: safeInviteLinkPassword
          ? _createRedactor(safeInviteLinkPassword)
          : undefined,
      });

      return Proto.GroupChangeResponse.decode(response);
    }

    async function getGroupLog(
      options: GetGroupLogOptionsType,
      credentials: GroupCredentialsType
    ): Promise<GroupLogResponseType> {
      const basicAuth = generateGroupAuth(
        credentials.groupPublicParamsHex,
        credentials.authCredentialPresentationHex
      );

      const {
        startVersion,
        includeFirstState,
        includeLastState,
        maxSupportedChangeEpoch,
        cachedEndorsementsExpiration,
      } = options;

      // If we don't know starting revision - fetch it from the server
      if (startVersion === undefined) {
        const { data: joinedData } = await _ajax({
          basicAuth,
          call: 'groupJoinedAtVersion',
          contentType: 'application/x-protobuf',
          host: storageUrl,
          disableSessionResumption: true,
          httpType: 'GET',
          responseType: 'byteswithdetails',
        });

        const { joinedAtVersion } = Proto.Member.decode(joinedData);

        return getGroupLog(
          {
            ...options,
            startVersion: joinedAtVersion ?? 0,
          },
          credentials
        );
      }

      const withDetails = await _ajax({
        basicAuth,
        call: 'groupLog',
        contentType: 'application/x-protobuf',
        host: storageUrl,
        disableSessionResumption: true,
        httpType: 'GET',
        responseType: 'byteswithdetails',
        headers: {
          'Cached-Send-Endorsements': String(cachedEndorsementsExpiration ?? 0),
        },
        urlParameters:
          `/${startVersion}?` +
          `includeFirstState=${Boolean(includeFirstState)}&` +
          `includeLastState=${Boolean(includeLastState)}&` +
          `maxSupportedChangeEpoch=${Number(maxSupportedChangeEpoch)}`,
      });
      const { data, response } = withDetails;
      const changes = Proto.GroupChanges.decode(data);
      const { groupSendEndorsementResponse } = changes;

      if (response && response.status === 206) {
        const range = response.headers.get('Content-Range');
        const match = PARSE_GROUP_LOG_RANGE_HEADER.exec(range || '');

        const start = match ? parseInt(match[1], 10) : undefined;
        const end = match ? parseInt(match[2], 10) : undefined;
        const currentRevision = match ? parseInt(match[3], 10) : undefined;

        if (
          match &&
          isNumber(start) &&
          isNumber(end) &&
          isNumber(currentRevision)
        ) {
          return {
            paginated: true,
            changes,
            start,
            end,
            currentRevision,
            groupSendEndorsementResponse,
          };
        }
      }

      return {
        paginated: false,
        changes,
        groupSendEndorsementResponse,
      };
    }

    async function getHasSubscription(
      subscriberId: Uint8Array
    ): Promise<boolean> {
      const formattedId = toWebSafeBase64(toBase64(subscriberId));
      const data = await _ajax({
        call: 'subscriptions',
        httpType: 'GET',
        urlParameters: `/${formattedId}`,
        responseType: 'json',
        unauthenticated: true,
        accessKey: undefined,
        redactUrl: _createRedactor(formattedId),
      });

      return (
        isRecord(data) &&
        isRecord(data.subscription) &&
        Boolean(data.subscription.active)
      );
    }

    function getProvisioningResource(
      handler: IRequestHandler
    ): Promise<IWebSocketResource> {
      return socketManager.getProvisioningResource(handler);
    }

    async function cdsLookup({
      e164s,
      acisAndAccessKeys = [],
      returnAcisWithoutUaks,
      useLibsignal,
    }: CdsLookupOptionsType): Promise<CDSResponseType> {
      return cds.request({
        e164s,
        acisAndAccessKeys,
        returnAcisWithoutUaks,
        useLibsignal,
      });
    }
  }
}
