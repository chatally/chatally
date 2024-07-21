import type { PlaintextContent } from '@signalapp/libsignal-client';
import type { ServiceIdString } from './ServiceId';
import type { SignalServer } from './SignalServer';
import { signalservice as Proto } from './protos/compiled';
import type { SerializedCertificateType } from './schema';
import type { CallbackResultType } from './types';

export class OutgoingMessage {
  message: Proto.Content | PlaintextContent;
  server: SignalServer;
  timestamp: number;
  serviceIds: readonly ServiceIdString[];
  callback: (result: CallbackResultType) => void;
  groupId: string;
  story: boolean;
  urgent: boolean;
  serviceIdsCompleted: number;
  errors: any[];
  successfulServiceIds: any[];
  failoverServiceIds: any[];
  unidentifiedDeliveries: any[];
  recipients: {};
  sendLogCallback: SendLogCallbackType;
  sendMetadata: any;
  online: any;

  constructor({
    callback,
    // contentHint,
    groupId,
    serviceIds,
    message,
    options,
    sendLogCallback,
    server,
    story,
    timestamp,
    urgent,
  }: {
    callback: (result: CallbackResultType) => void;
    serviceIds: ReadonlyArray<ServiceIdString>;
    message: Proto.Content | Proto.DataMessage | PlaintextContent;
    server: SignalServer;
    // contentHint: number;
    groupId?: string;
    options?: OutgoingMessageOptionsType;
    sendLogCallback?: SendLogCallbackType;
    story?: boolean;
    timestamp: number;
    urgent: boolean;
  }) {
    if (message instanceof Proto.DataMessage) {
      const content = new Proto.Content();
      content.dataMessage = message;
      this.message = content;
    } else {
      this.message = message;
    }

    this.server = server;
    this.timestamp = timestamp;
    this.serviceIds = serviceIds;
    this.callback = callback;
    // this.contentHint = contentHint;
    this.groupId = groupId;
    this.story = story;
    this.urgent = urgent;

    this.serviceIdsCompleted = 0;
    this.errors = [];
    this.successfulServiceIds = [];
    this.failoverServiceIds = [];
    this.unidentifiedDeliveries = [];
    this.recipients = {};
    this.sendLogCallback = sendLogCallback;

    this.sendMetadata = options?.sendMetadata;
    this.online = options?.online;
  }

  async sendToServiceId(serviceId: ServiceIdString): Promise<void> {
    try {
      if (deviceIds.length === 0) {
        await this.getKeysForServiceId(serviceId);
      }
      await this.reloadDevicesAndSend(serviceId, true)();
    } catch (error) {
      if (
        error instanceof LibSignalErrorBase &&
        error.code === ErrorCode.UntrustedIdentity
      ) {
        const newError = new OutgoingIdentityKeyError(serviceId, error);
        this.registerError(serviceId, 'Untrusted identity', newError);
      } else {
        this.registerError(
          serviceId,
          `Failed to retrieve new device keys for serviceId ${serviceId}`,
          error
        );
      }
    }
  }
}

export type SendLogCallbackType = (options: {
  serviceId: ServiceIdString;
  deviceIds: Array<number>;
}) => Promise<void>;

type OutgoingMessageOptionsType = SendOptionsType & {
  online?: boolean;
};

export type SendOptionsType = {
  sendMetadata?: SendMetadataType;
  online?: boolean;
};

export type SendMetadataType = {
  [serviceId: ServiceIdString]: {
    accessKey: string;
    senderCertificate?: SerializedCertificateType;
  };
};
