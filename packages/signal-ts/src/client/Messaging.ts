import type { Logger } from '@chatally/logger';
import type { PlaintextContent } from '@signalapp/libsignal-client';
import Long from 'long';
import PQueue from 'p-queue';
import type { AccountManager } from './AccountManager';
import { OutgoingMessage } from './OutgoingMessage';
import { ServiceIdKind, type ServiceIdString } from './ServiceId';
import type { SignalServer } from './SignalServer';
import createTaskWithTimeout from './TaskWithTimeout';
import { signalservice as Proto } from './protos/compiled';
import type { CallbackResultType } from './types';
import { drop } from './util/drop';

interface Config {
  log: Logger;
  account: AccountManager;
  server: SignalServer;
}

export class Messaging {
  log: Logger;
  account: AccountManager;
  server: SignalServer;
  pendingMessages: Record<string, PQueue>;

  constructor({ log, account, server }: Config) {
    this.log = log;
    this.account = account;
    this.server = server;
    this.pendingMessages = {};
  }

  // You might wonder why this takes a groupId. models/messages.resend() can 
  // send a group message to just one person.
  async sendMessage({
    serviceId,
    messageText,
    timestamp = Date.now(),
    urgent = false,
    // attachments,
    // bodyRanges,
    // contact,
    // contentHint,
    // deletedForEveryoneTimestamp,
    // expireTimer,
    // groupId,
    // includePniSignatureMessage,
    // options,
    // preview,
    // profileKey,
    // quote,
    // reaction,
    // sticker,
    // story,
    // storyContext,
    // targetTimestampForEdit,
  }: Readonly<{
    messageText: string | undefined;
    serviceId: ServiceIdString;
    timestamp?: number;
    urgent?: boolean;
    // attachments?: ReadonlyArray<UploadedAttachmentType>;
    // bodyRanges?: ReadonlyArray<RawBodyRange>;
    // contact?: ReadonlyArray<EmbeddedContactWithUploadedAvatar>;
    // contentHint: number;
    // deletedForEveryoneTimestamp?: number;
    // expireTimer?: DurationInSeconds;
    // groupId?: string;
    // includePniSignatureMessage?: boolean;
    // options?: SendOptionsType;
    // preview?: ReadonlyArray<OutgoingLinkPreviewType> | undefined;
    // profileKey?: Uint8Array;
    // quote?: OutgoingQuoteType;
    // reaction?: ReactionType;
    // sticker?: OutgoingStickerType;
    // story?: boolean;
    // storyContext?: StoryContextType;
    // targetTimestampForEdit?: number;
  }>): Promise<CallbackResultType> {
    const proto = await this.#getContentMessage({
      body: messageText,
      recipients: [serviceId],
      timestamp,
      // attachments,
      // bodyRanges,
      // contact,
      // deletedForEveryoneTimestamp,
      // expireTimer,
      // includePniSignatureMessage,
      // preview,
      // profileKey,
      // quote,
      // reaction,
      // sticker,
      // storyContext,
      // targetTimestampForEdit,
    });

    return new Promise((resolve, reject) => {
      drop(
        this.#sendMessageProto({
          callback: (res: CallbackResultType) => {
            if (res.errors && res.errors.length > 0) {
              reject(new SendMessageProtoError(res));
            } else {
              resolve(res);
            }
          },
          proto,
          recipients: [serviceId],
          timestamp,
          urgent,
          // contentHint,
          // groupId,
          // options,
          // story,
        })
      );
    });
  }

  async #getContentMessage(
    options: Readonly<MessageOptionsType>
    // & Readonly<{
    //   includePniSignatureMessage?: boolean;
    // }>
  ): Promise<Proto.Content> {
    const message = new Message(options);
    const dataMessage = message.toProto();

    const contentMessage = new Proto.Content();
    // if (options.targetTimestampForEdit) {
    //   const editMessage = new Proto.EditMessage();
    //   editMessage.dataMessage = dataMessage;
    //   editMessage.targetSentTimestamp = Long.fromNumber(
    //     options.targetTimestampForEdit
    //   );
    //   contentMessage.editMessage = editMessage;
    // } else {
    contentMessage.dataMessage = dataMessage;
    // }

    // const { includePniSignatureMessage } = options;
    // if (includePniSignatureMessage) {
    //   strictAssert(
    //     message.recipients.length === 1,
    //     'getContentMessage: includePniSignatureMessage is single recipient only'
    //   );

    //   const conversation = window.ConversationController.get(
    //     message.recipients[0]
    //   );

    //   addPniSignatureMessageToProto({
    //     conversation,
    //     proto: contentMessage,
    //     reason: `getContentMessage(${message.timestamp})`,
    //   });
    // }

    return contentMessage;
  }

  // Note: all the other low-level sends call this, so it is a chokepoint for 1:1 sends
  //   The chokepoint for group sends is sendContentMessageToGroup
  async #sendMessageProto({
    callback,
    proto,
    recipients,
    timestamp,
    urgent,
    // contentHint,
    // groupId,
    // options,
    // sendLogCallback,
    // story,
  }: Readonly<{
    callback: (result: CallbackResultType) => void;
    recipients: ReadonlyArray<ServiceIdString>;
    timestamp: number;
    urgent: boolean;
    proto: Proto.Content | Proto.DataMessage | PlaintextContent;
    // contentHint: number;
    // groupId?: string;
    // options?: SendOptionsType;
    // sendLogCallback?: SendLogCallbackType;
    // story?: boolean;
  }>): Promise<void> {
    try {
      // if (accountManager.areKeysOutOfDate(ServiceIdKind.ACI)) {
      //   this.log.warn(
      //     `sendMessageProto/${timestamp}: Keys are out of date; updating...`
      //   );
      //   await accountManager.maybeUpdateKeys(ServiceIdKind.ACI);
      //   if (accountManager.areKeysOutOfDate(ServiceIdKind.ACI)) {
      //     throw new Error('Keys still out of date after update');
      //   }
      // }
      await this.account.maybeUpdateKeys(ServiceIdKind.ACI);
    } catch (error) {
      callback({
        dataMessage: undefined,
        editMessage: undefined,
        errors: [error],
      });
      return;
    }

    const outgoing = new OutgoingMessage({
      callback,
      message: proto,
      server: this.server,
      serviceIds: recipients,
      timestamp,
      urgent,
      // contentHint,
      // groupId,
      // options,
      // sendLogCallback,
      // story,
    });

    recipients.forEach(serviceId => {
      drop(
        this.queueJobForServiceId(
          serviceId,
          async () => outgoing.sendToServiceId(serviceId)
        )
      );
    });
  }

  async queueJobForServiceId<T>(serviceId: string, runJob: () => Promise<T>): Promise<T> {
    const queue = this.pendingMessages[serviceId] ??= new PQueue({ concurrency: 1 });
    const taskWithTimeout = createTaskWithTimeout(
      runJob,
      `queueJobForServiceId ${serviceId}`
    );

    return (await queue.add(taskWithTimeout)) as T;
  }
}

type MessageOptionsType = {
  recipients: ReadonlyArray<ServiceIdString>;
  timestamp: number;
  body?: string;
  // attachments?: ReadonlyArray<UploadedAttachmentType>;
  // bodyRanges?: ReadonlyArray<RawBodyRange>;
  // contact?: ReadonlyArray<EmbeddedContactWithUploadedAvatar>;
  // deletedForEveryoneTimestamp?: number;
  // expireTimer?: DurationInSeconds;
  // flags?: number;
  // group?: { id: string; type: number; };
  // groupCallUpdate?: GroupCallUpdateType;
  // groupV2?: GroupV2InfoType;
  // needsSync?: boolean;
  // preview?: ReadonlyArray<OutgoingLinkPreviewType>;
  // profileKey?: Uint8Array;
  // quote?: OutgoingQuoteType;
  // reaction?: ReactionType;
  // sticker?: OutgoingStickerType;
  // storyContext?: StoryContextType;
  // targetTimestampForEdit?: number;
};

export class SendMessageProtoError extends Error implements CallbackResultType {
  public readonly successfulServiceIds?: Array<ServiceIdString>;
  public readonly failoverServiceIds?: Array<ServiceIdString>;
  public readonly errors?: CallbackResultType['errors'];
  public readonly unidentifiedDeliveries?: Array<ServiceIdString>;
  public readonly dataMessage: Uint8Array | undefined;
  public readonly editMessage: Uint8Array | undefined;

  // Fields necessary for send log save
  // public readonly contentHint?: number;
  public readonly contentProto?: Uint8Array;
  public readonly timestamp?: number;
  public readonly recipients?: Record<ServiceIdString, Array<number>>;
  public readonly sendIsNotFinal?: boolean;

  constructor({
    contentProto,
    dataMessage,
    editMessage,
    errors,
    failoverServiceIds,
    recipients,
    sendIsNotFinal,
    successfulServiceIds,
    timestamp,
    unidentifiedDeliveries,
    // contentHint,
  }: CallbackResultType) {
    super(`SendMessageProtoError: ${SendMessageProtoError.getMessage(errors)}`);

    // this.contentHint = contentHint;
    this.contentProto = contentProto;
    this.dataMessage = dataMessage;
    this.editMessage = editMessage;
    this.errors = errors;
    this.failoverServiceIds = failoverServiceIds;
    this.recipients = recipients;
    this.sendIsNotFinal = sendIsNotFinal;
    this.successfulServiceIds = successfulServiceIds;
    this.timestamp = timestamp;
    this.unidentifiedDeliveries = unidentifiedDeliveries;
  }

  protected static getMessage(errors: CallbackResultType['errors']): string {
    if (!errors) {
      return 'No errors';
    }

    return errors.map(error => error.toString()).join(', ');
  }
}

class Message {
  body?: string;
  recipients: ReadonlyArray<ServiceIdString>;
  timestamp: number;
  // attachments: ReadonlyArray<UploadedAttachmentType>;
  // bodyRanges?: ReadonlyArray<RawBodyRange>;
  // contact?: ReadonlyArray<EmbeddedContactWithUploadedAvatar>;
  dataMessage?: Proto.DataMessage;
  // deletedForEveryoneTimestamp?: number;
  // expireTimer?: DurationInSeconds;
  // flags?: number;
  // group?: {    id: string;    type: number;  };
  // groupCallUpdate?: GroupCallUpdateType;
  // groupV2?: GroupV2InfoType;
  // needsSync?: boolean;
  // preview?: ReadonlyArray<OutgoingLinkPreviewType>;
  // profileKey?: Uint8Array;
  // quote?: OutgoingQuoteType;
  // reaction?: ReactionType;
  // sticker?: OutgoingStickerType;
  // storyContext?: StoryContextType;

  constructor(options: MessageOptionsType) {
    this.recipients = options.recipients;
    this.timestamp = options.timestamp;
    this.body = options.body;
    // this.attachments = options.attachments || [];
    // this.bodyRanges = options.bodyRanges;
    // this.contact = options.contact;
    // this.deletedForEveryoneTimestamp = options.deletedForEveryoneTimestamp;
    // this.expireTimer = options.expireTimer;
    // this.flags = options.flags;
    // this.group = options.group;
    // this.groupCallUpdate = options.groupCallUpdate;
    // this.groupV2 = options.groupV2;
    // this.needsSync = options.needsSync;
    // this.preview = options.preview;
    // this.profileKey = options.profileKey;
    // this.quote = options.quote;
    // this.reaction = options.reaction;
    // this.sticker = options.sticker;
    // this.storyContext = options.storyContext;

    if (!(this.recipients instanceof Array)) {
      throw new Error('Invalid recipient list');
    }

    // if (this.recipients.length !== 1 && !this.group && !this.groupV2) {
    //   throw new Error('Invalid recipient list for non-group');
    // }  

    if (typeof this.timestamp !== 'number') {
      throw new Error('Invalid timestamp');
    }

    // if (this.expireTimer != null) {
    //   if (typeof this.expireTimer !== 'number' || !(this.expireTimer >= 0)) {
    //     throw new Error('Invalid expireTimer');
    //   }
    // }

    // if (this.attachments) {
    //   if (!(this.attachments instanceof Array)) {
    //     throw new Error('Invalid message attachments');
    //   }
    // }

    // if (this.flags !== undefined) {
    //   if (typeof this.flags !== 'number') {
    //     throw new Error('Invalid message flags');
    //   }
    // }

    if (this.isEndSession()) {
      if (
        this.body != null
        // || this.group != null
        // || this.attachments.length !== 0
      ) {
        throw new Error('Invalid end session message');
      }
    } else {
      if (
        typeof this.timestamp !== 'number' ||
        (this.body && typeof this.body !== 'string')
      ) {
        throw new Error('Invalid message body');
      }
      // if (this.group) {
      //   if (
      //     typeof this.group.id !== 'string' ||
      //     typeof this.group.type !== 'number'
      //   ) {
      //     throw new Error('Invalid group context');
      //   }
      // }
    }
  }

  isEndSession() {
    // return (this.flags || 0) & Proto.DataMessage.Flags.END_SESSION;
    return 0 & Proto.DataMessage.Flags.END_SESSION;
  }

  toProto(): Proto.DataMessage {
    // if (this.dataMessage) {
    //   return this.dataMessage;
    // }
    const proto = new Proto.DataMessage();

    proto.timestamp = Long.fromNumber(this.timestamp);
    // proto.attachments = this.attachments.slice();

    if (this.body) {
      proto.body = this.body;

      // const mentionCount = 0;
      // this.bodyRanges
      //   ? this.bodyRanges.filter(BodyRange.isMention).length
      //   : 0;
      // const otherRangeCount = this.bodyRanges
      //   ? this.bodyRanges.length - mentionCount
      //   : 0;
      // const placeholders = this.body.match(/\uFFFC/g);
      // const placeholderCount = placeholders ? placeholders.length : 0;
      // const storyInfo = this.storyContext
      //   ? `, story: ${this.storyContext.timestamp}`
      //   : '';
    }
    // if (this.flags) {
    //   proto.flags = this.flags;
    // }
    // if (this.groupV2) {
    //   proto.groupV2 = new Proto.GroupContextV2();
    //   proto.groupV2.masterKey = this.groupV2.masterKey;
    //   proto.groupV2.revision = this.groupV2.revision;
    //   proto.groupV2.groupChange = this.groupV2.groupChange || null;
    // }
    // if (this.sticker) {
    //   proto.sticker = new Proto.DataMessage.Sticker();
    //   proto.sticker.packId = Buffer.from(this.sticker.packId, "hex");
    //   proto.sticker.packKey = Buffer.from(this.sticker.packKey, "base64");
    //   proto.sticker.stickerId = this.sticker.stickerId;
    //   proto.sticker.emoji = this.sticker.emoji;
    //   proto.sticker.data = this.sticker.data;
    // }
    // if (this.reaction) {
    //   proto.reaction = new Proto.DataMessage.Reaction();
    //   proto.reaction.emoji = this.reaction.emoji || null;
    //   proto.reaction.remove = this.reaction.remove || false;
    //   proto.reaction.targetAuthorAci = this.reaction.targetAuthorAci || null;
    //   proto.reaction.targetTimestamp =
    //     this.reaction.targetTimestamp === undefined
    //       ? null
    //       : Long.fromNumber(this.reaction.targetTimestamp);
    // }

    // if (Array.isArray(this.preview)) {
    //   proto.preview = this.preview.map(preview => {
    //     const item = new Proto.DataMessage.Preview();
    //     item.title = preview.title;
    //     item.url = preview.url;
    //     item.description = preview.description || null;
    //     item.date = preview.date || null;
    //     if (preview.image) {
    //       item.image = preview.image;
    //     }
    //     return item;
    //   });
    // }

    // if (Array.isArray(this.contact)) {
    //   proto.contact = this.contact.map(
    //     (contact: EmbeddedContactWithUploadedAvatar) => {
    //       const contactProto = new Proto.DataMessage.Contact();
    //       if (contact.name) {
    //         const nameProto: Proto.DataMessage.Contact.IName = {
    //           givenName: contact.name.givenName,
    //           familyName: contact.name.familyName,
    //           prefix: contact.name.prefix,
    //           suffix: contact.name.suffix,
    //           middleName: contact.name.middleName,
    //           displayName: contact.name.displayName,
    //         };
    //         contactProto.name = new Proto.DataMessage.Contact.Name(nameProto);
    //       }
    //       if (Array.isArray(contact.number)) {
    //         contactProto.number = contact.number.map(number => {
    //           const numberProto: Proto.DataMessage.Contact.IPhone = {
    //             value: number.value,
    //             type: numberToPhoneType(number.type),
    //             label: number.label,
    //           };

    //           return new Proto.DataMessage.Contact.Phone(numberProto);
    //         });
    //       }
    //       if (Array.isArray(contact.email)) {
    //         contactProto.email = contact.email.map(email => {
    //           const emailProto: Proto.DataMessage.Contact.IEmail = {
    //             value: email.value,
    //             type: numberToEmailType(email.type),
    //             label: email.label,
    //           };

    //           return new Proto.DataMessage.Contact.Email(emailProto);
    //         });
    //       }
    //       if (Array.isArray(contact.address)) {
    //         contactProto.address = contact.address.map(address => {
    //           const addressProto: Proto.DataMessage.Contact.IPostalAddress = {
    //             type: numberToAddressType(address.type),
    //             label: address.label,
    //             street: address.street,
    //             pobox: address.pobox,
    //             neighborhood: address.neighborhood,
    //             city: address.city,
    //             region: address.region,
    //             postcode: address.postcode,
    //             country: address.country,
    //           };

    //           return new Proto.DataMessage.Contact.PostalAddress(addressProto);
    //         });
    //       }
    //       if (contact.avatar?.avatar) {
    //         const avatarProto = new Proto.DataMessage.Contact.Avatar();
    //         avatarProto.avatar = contact.avatar.avatar;
    //         avatarProto.isProfile = Boolean(contact.avatar.isProfile);
    //         contactProto.avatar = avatarProto;
    //       }

    //       if (contact.organization) {
    //         contactProto.organization = contact.organization;
    //       }

    //       return contactProto;
    //     }
    //   );
    // }

    // if (this.quote) {
    //   const { BodyRange: ProtoBodyRange, Quote } = Proto.DataMessage;

    //   proto.quote = new Quote();
    //   const { quote } = proto;

    //   if (this.quote.isGiftBadge) {
    //     quote.type = Proto.DataMessage.Quote.Type.GIFT_BADGE;
    //   } else {
    //     quote.type = Proto.DataMessage.Quote.Type.NORMAL;
    //   }

    //   quote.id =
    //     this.quote.id === undefined ? null : Long.fromNumber(this.quote.id);
    //   quote.authorAci = this.quote.authorAci || null;
    //   quote.text = this.quote.text || null;
    //   quote.attachments = this.quote.attachments.slice() || [];
    //   const bodyRanges = this.quote.bodyRanges || [];
    //   quote.bodyRanges = bodyRanges.map(range => {
    //     const bodyRange = new ProtoBodyRange();
    //     bodyRange.start = range.start;
    //     bodyRange.length = range.length;
    //     if (BodyRange.isMention(range)) {
    //       bodyRange.mentionAci = range.mentionAci;
    //     } else if (BodyRange.isFormatting(range)) {
    //       bodyRange.style = range.style;
    //     } else {
    //       throw missingCaseError(range);
    //     }
    //     return bodyRange;
    //   });
    //   if (
    //     quote.bodyRanges.length &&
    //     (!proto.requiredProtocolVersion ||
    //       proto.requiredProtocolVersion <
    //       Proto.DataMessage.ProtocolVersion.MENTIONS)
    //   ) {
    //     proto.requiredProtocolVersion =
    //       Proto.DataMessage.ProtocolVersion.MENTIONS;
    //   }
    // }

    // if (this.expireTimer) {
    //   proto.expireTimer = this.expireTimer;
    // }

    // if (this.profileKey) {
    //   proto.profileKey = this.profileKey;
    // }

    // if (this.deletedForEveryoneTimestamp) {
    //   proto.delete = {
    //     targetSentTimestamp: Long.fromNumber(this.deletedForEveryoneTimestamp),
    //   };
    // }

    // if (this.bodyRanges) {
    //   proto.requiredProtocolVersion =
    //     Proto.DataMessage.ProtocolVersion.MENTIONS;
    //   proto.bodyRanges = this.bodyRanges.map(bodyRange => {
    //     const { start, length } = bodyRange;
    //     if (BodyRange.isMention(bodyRange)) {
    //       return {
    //         start,
    //         length,
    //         mentionAci: bodyRange.mentionAci,
    //       };
    //     }
    //     if (BodyRange.isFormatting(bodyRange)) {
    //       return {
    //         start,
    //         length,
    //         style: bodyRange.style,
    //       };
    //     }
    //     throw missingCaseError(bodyRange);
    //   });
    // }

    // if (this.groupCallUpdate) {
    //   const { GroupCallUpdate } = Proto.DataMessage;

    //   const groupCallUpdate = new GroupCallUpdate();
    //   groupCallUpdate.eraId = this.groupCallUpdate.eraId;

    //   proto.groupCallUpdate = groupCallUpdate;
    // }

    // if (this.storyContext) {
    //   const { StoryContext } = Proto.DataMessage;

    //   const storyContext = new StoryContext();
    //   if (this.storyContext.authorAci) {
    //     storyContext.authorAci = this.storyContext.authorAci;
    //   }
    //   storyContext.sentTimestamp = Long.fromNumber(this.storyContext.timestamp);

    //   proto.storyContext = storyContext;
    // }

    this.dataMessage = proto;
    return proto;
  }
}
