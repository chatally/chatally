import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace signalservice. */
export namespace signalservice {

    /** Properties of a ProvisioningUuid. */
    interface IProvisioningUuid {

        /** ProvisioningUuid uuid */
        uuid?: (string|null);
    }

    /** Represents a ProvisioningUuid. */
    class ProvisioningUuid implements IProvisioningUuid {

        /**
         * Constructs a new ProvisioningUuid.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IProvisioningUuid);

        /** ProvisioningUuid uuid. */
        public uuid: string;

        /**
         * Creates a new ProvisioningUuid instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProvisioningUuid instance
         */
        public static create(properties?: signalservice.IProvisioningUuid): signalservice.ProvisioningUuid;

        /**
         * Encodes the specified ProvisioningUuid message. Does not implicitly {@link signalservice.ProvisioningUuid.verify|verify} messages.
         * @param message ProvisioningUuid message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IProvisioningUuid, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ProvisioningUuid message, length delimited. Does not implicitly {@link signalservice.ProvisioningUuid.verify|verify} messages.
         * @param message ProvisioningUuid message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IProvisioningUuid, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ProvisioningUuid message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProvisioningUuid
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.ProvisioningUuid;

        /**
         * Decodes a ProvisioningUuid message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProvisioningUuid
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.ProvisioningUuid;

        /**
         * Verifies a ProvisioningUuid message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ProvisioningUuid message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ProvisioningUuid
         */
        public static fromObject(object: { [k: string]: any }): signalservice.ProvisioningUuid;

        /**
         * Creates a plain object from a ProvisioningUuid message. Also converts values to other types if specified.
         * @param message ProvisioningUuid
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.ProvisioningUuid, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ProvisioningUuid to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ProvisioningUuid
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ProvisionEnvelope. */
    interface IProvisionEnvelope {

        /** ProvisionEnvelope publicKey */
        publicKey?: (Uint8Array|null);

        /** ProvisionEnvelope body */
        body?: (Uint8Array|null);
    }

    /** Represents a ProvisionEnvelope. */
    class ProvisionEnvelope implements IProvisionEnvelope {

        /**
         * Constructs a new ProvisionEnvelope.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IProvisionEnvelope);

        /** ProvisionEnvelope publicKey. */
        public publicKey: Uint8Array;

        /** ProvisionEnvelope body. */
        public body: Uint8Array;

        /**
         * Creates a new ProvisionEnvelope instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProvisionEnvelope instance
         */
        public static create(properties?: signalservice.IProvisionEnvelope): signalservice.ProvisionEnvelope;

        /**
         * Encodes the specified ProvisionEnvelope message. Does not implicitly {@link signalservice.ProvisionEnvelope.verify|verify} messages.
         * @param message ProvisionEnvelope message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IProvisionEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ProvisionEnvelope message, length delimited. Does not implicitly {@link signalservice.ProvisionEnvelope.verify|verify} messages.
         * @param message ProvisionEnvelope message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IProvisionEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ProvisionEnvelope message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProvisionEnvelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.ProvisionEnvelope;

        /**
         * Decodes a ProvisionEnvelope message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProvisionEnvelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.ProvisionEnvelope;

        /**
         * Verifies a ProvisionEnvelope message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ProvisionEnvelope message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ProvisionEnvelope
         */
        public static fromObject(object: { [k: string]: any }): signalservice.ProvisionEnvelope;

        /**
         * Creates a plain object from a ProvisionEnvelope message. Also converts values to other types if specified.
         * @param message ProvisionEnvelope
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.ProvisionEnvelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ProvisionEnvelope to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ProvisionEnvelope
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ProvisionMessage. */
    interface IProvisionMessage {

        /** ProvisionMessage aciIdentityKeyPublic */
        aciIdentityKeyPublic?: (Uint8Array|null);

        /** ProvisionMessage aciIdentityKeyPrivate */
        aciIdentityKeyPrivate?: (Uint8Array|null);

        /** ProvisionMessage pniIdentityKeyPublic */
        pniIdentityKeyPublic?: (Uint8Array|null);

        /** ProvisionMessage pniIdentityKeyPrivate */
        pniIdentityKeyPrivate?: (Uint8Array|null);

        /** ProvisionMessage aci */
        aci?: (string|null);

        /** ProvisionMessage pni */
        pni?: (string|null);

        /** ProvisionMessage number */
        number?: (string|null);

        /** ProvisionMessage provisioningCode */
        provisioningCode?: (string|null);

        /** ProvisionMessage userAgent */
        userAgent?: (string|null);

        /** ProvisionMessage profileKey */
        profileKey?: (Uint8Array|null);

        /** ProvisionMessage readReceipts */
        readReceipts?: (boolean|null);

        /** ProvisionMessage ProvisioningVersion */
        ProvisioningVersion?: (number|null);

        /** ProvisionMessage masterKey */
        masterKey?: (Uint8Array|null);
    }

    /** Represents a ProvisionMessage. */
    class ProvisionMessage implements IProvisionMessage {

        /**
         * Constructs a new ProvisionMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IProvisionMessage);

        /** ProvisionMessage aciIdentityKeyPublic. */
        public aciIdentityKeyPublic: Uint8Array;

        /** ProvisionMessage aciIdentityKeyPrivate. */
        public aciIdentityKeyPrivate: Uint8Array;

        /** ProvisionMessage pniIdentityKeyPublic. */
        public pniIdentityKeyPublic: Uint8Array;

        /** ProvisionMessage pniIdentityKeyPrivate. */
        public pniIdentityKeyPrivate: Uint8Array;

        /** ProvisionMessage aci. */
        public aci: string;

        /** ProvisionMessage pni. */
        public pni: string;

        /** ProvisionMessage number. */
        public number: string;

        /** ProvisionMessage provisioningCode. */
        public provisioningCode: string;

        /** ProvisionMessage userAgent. */
        public userAgent: string;

        /** ProvisionMessage profileKey. */
        public profileKey: Uint8Array;

        /** ProvisionMessage readReceipts. */
        public readReceipts: boolean;

        /** ProvisionMessage ProvisioningVersion. */
        public ProvisioningVersion: number;

        /** ProvisionMessage masterKey. */
        public masterKey: Uint8Array;

        /**
         * Creates a new ProvisionMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProvisionMessage instance
         */
        public static create(properties?: signalservice.IProvisionMessage): signalservice.ProvisionMessage;

        /**
         * Encodes the specified ProvisionMessage message. Does not implicitly {@link signalservice.ProvisionMessage.verify|verify} messages.
         * @param message ProvisionMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IProvisionMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ProvisionMessage message, length delimited. Does not implicitly {@link signalservice.ProvisionMessage.verify|verify} messages.
         * @param message ProvisionMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IProvisionMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ProvisionMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProvisionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.ProvisionMessage;

        /**
         * Decodes a ProvisionMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProvisionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.ProvisionMessage;

        /**
         * Verifies a ProvisionMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ProvisionMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ProvisionMessage
         */
        public static fromObject(object: { [k: string]: any }): signalservice.ProvisionMessage;

        /**
         * Creates a plain object from a ProvisionMessage message. Also converts values to other types if specified.
         * @param message ProvisionMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.ProvisionMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ProvisionMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ProvisionMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** ProvisioningVersion enum. */
    enum ProvisioningVersion {
        INITIAL = 0,
        TABLET_SUPPORT = 1,
        CURRENT = 1
    }

    /** Properties of a DeviceName. */
    interface IDeviceName {

        /** DeviceName ephemeralPublic */
        ephemeralPublic?: (Uint8Array|null);

        /** DeviceName syntheticIv */
        syntheticIv?: (Uint8Array|null);

        /** DeviceName ciphertext */
        ciphertext?: (Uint8Array|null);
    }

    /** Represents a DeviceName. */
    class DeviceName implements IDeviceName {

        /**
         * Constructs a new DeviceName.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IDeviceName);

        /** DeviceName ephemeralPublic. */
        public ephemeralPublic: Uint8Array;

        /** DeviceName syntheticIv. */
        public syntheticIv: Uint8Array;

        /** DeviceName ciphertext. */
        public ciphertext: Uint8Array;

        /**
         * Creates a new DeviceName instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeviceName instance
         */
        public static create(properties?: signalservice.IDeviceName): signalservice.DeviceName;

        /**
         * Encodes the specified DeviceName message. Does not implicitly {@link signalservice.DeviceName.verify|verify} messages.
         * @param message DeviceName message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IDeviceName, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeviceName message, length delimited. Does not implicitly {@link signalservice.DeviceName.verify|verify} messages.
         * @param message DeviceName message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IDeviceName, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeviceName message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeviceName
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DeviceName;

        /**
         * Decodes a DeviceName message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeviceName
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DeviceName;

        /**
         * Verifies a DeviceName message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeviceName message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeviceName
         */
        public static fromObject(object: { [k: string]: any }): signalservice.DeviceName;

        /**
         * Creates a plain object from a DeviceName message. Also converts values to other types if specified.
         * @param message DeviceName
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.DeviceName, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeviceName to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DeviceName
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an Envelope. */
    interface IEnvelope {

        /** Envelope type */
        type?: (signalservice.Envelope.Type|null);

        /** Envelope sourceServiceId */
        sourceServiceId?: (string|null);

        /** Envelope sourceDevice */
        sourceDevice?: (number|null);

        /** Envelope destinationServiceId */
        destinationServiceId?: (string|null);

        /** Envelope timestamp */
        timestamp?: (number|Long|null);

        /** Envelope content */
        content?: (Uint8Array|null);

        /** Envelope serverGuid */
        serverGuid?: (string|null);

        /** Envelope serverTimestamp */
        serverTimestamp?: (number|Long|null);

        /** Envelope ephemeral */
        ephemeral?: (boolean|null);

        /** Envelope urgent */
        urgent?: (boolean|null);

        /** Envelope updatedPni */
        updatedPni?: (string|null);

        /** Envelope story */
        story?: (boolean|null);

        /** Envelope reportingToken */
        reportingToken?: (Uint8Array|null);
    }

    /** Represents an Envelope. */
    class Envelope implements IEnvelope {

        /**
         * Constructs a new Envelope.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IEnvelope);

        /** Envelope type. */
        public type: signalservice.Envelope.Type;

        /** Envelope sourceServiceId. */
        public sourceServiceId: string;

        /** Envelope sourceDevice. */
        public sourceDevice: number;

        /** Envelope destinationServiceId. */
        public destinationServiceId: string;

        /** Envelope timestamp. */
        public timestamp: (number|Long);

        /** Envelope content. */
        public content: Uint8Array;

        /** Envelope serverGuid. */
        public serverGuid: string;

        /** Envelope serverTimestamp. */
        public serverTimestamp: (number|Long);

        /** Envelope ephemeral. */
        public ephemeral: boolean;

        /** Envelope urgent. */
        public urgent: boolean;

        /** Envelope updatedPni. */
        public updatedPni: string;

        /** Envelope story. */
        public story: boolean;

        /** Envelope reportingToken. */
        public reportingToken: Uint8Array;

        /**
         * Creates a new Envelope instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Envelope instance
         */
        public static create(properties?: signalservice.IEnvelope): signalservice.Envelope;

        /**
         * Encodes the specified Envelope message. Does not implicitly {@link signalservice.Envelope.verify|verify} messages.
         * @param message Envelope message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Envelope message, length delimited. Does not implicitly {@link signalservice.Envelope.verify|verify} messages.
         * @param message Envelope message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Envelope message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Envelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.Envelope;

        /**
         * Decodes an Envelope message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Envelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.Envelope;

        /**
         * Verifies an Envelope message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Envelope message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Envelope
         */
        public static fromObject(object: { [k: string]: any }): signalservice.Envelope;

        /**
         * Creates a plain object from an Envelope message. Also converts values to other types if specified.
         * @param message Envelope
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.Envelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Envelope to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Envelope
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace Envelope {

        /** Type enum. */
        enum Type {
            UNKNOWN = 0,
            CIPHERTEXT = 1,
            KEY_EXCHANGE = 2,
            PREKEY_BUNDLE = 3,
            RECEIPT = 5,
            UNIDENTIFIED_SENDER = 6,
            PLAINTEXT_CONTENT = 8
        }
    }

    /** Properties of a Content. */
    interface IContent {

        /** Content dataMessage */
        dataMessage?: (signalservice.IDataMessage|null);

        /** Content syncMessage */
        syncMessage?: (signalservice.ISyncMessage|null);

        /** Content callingMessage */
        callingMessage?: (signalservice.ICallingMessage|null);

        /** Content nullMessage */
        nullMessage?: (signalservice.INullMessage|null);

        /** Content receiptMessage */
        receiptMessage?: (signalservice.IReceiptMessage|null);

        /** Content typingMessage */
        typingMessage?: (signalservice.ITypingMessage|null);

        /** Content senderKeyDistributionMessage */
        senderKeyDistributionMessage?: (Uint8Array|null);

        /** Content decryptionErrorMessage */
        decryptionErrorMessage?: (Uint8Array|null);

        /** Content storyMessage */
        storyMessage?: (signalservice.IStoryMessage|null);

        /** Content pniSignatureMessage */
        pniSignatureMessage?: (signalservice.IPniSignatureMessage|null);

        /** Content editMessage */
        editMessage?: (signalservice.IEditMessage|null);
    }

    /** Represents a Content. */
    class Content implements IContent {

        /**
         * Constructs a new Content.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IContent);

        /** Content dataMessage. */
        public dataMessage?: (signalservice.IDataMessage|null);

        /** Content syncMessage. */
        public syncMessage?: (signalservice.ISyncMessage|null);

        /** Content callingMessage. */
        public callingMessage?: (signalservice.ICallingMessage|null);

        /** Content nullMessage. */
        public nullMessage?: (signalservice.INullMessage|null);

        /** Content receiptMessage. */
        public receiptMessage?: (signalservice.IReceiptMessage|null);

        /** Content typingMessage. */
        public typingMessage?: (signalservice.ITypingMessage|null);

        /** Content senderKeyDistributionMessage. */
        public senderKeyDistributionMessage: Uint8Array;

        /** Content decryptionErrorMessage. */
        public decryptionErrorMessage: Uint8Array;

        /** Content storyMessage. */
        public storyMessage?: (signalservice.IStoryMessage|null);

        /** Content pniSignatureMessage. */
        public pniSignatureMessage?: (signalservice.IPniSignatureMessage|null);

        /** Content editMessage. */
        public editMessage?: (signalservice.IEditMessage|null);

        /**
         * Creates a new Content instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Content instance
         */
        public static create(properties?: signalservice.IContent): signalservice.Content;

        /**
         * Encodes the specified Content message. Does not implicitly {@link signalservice.Content.verify|verify} messages.
         * @param message Content message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IContent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Content message, length delimited. Does not implicitly {@link signalservice.Content.verify|verify} messages.
         * @param message Content message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IContent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Content message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Content
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.Content;

        /**
         * Decodes a Content message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Content
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.Content;

        /**
         * Verifies a Content message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Content message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Content
         */
        public static fromObject(object: { [k: string]: any }): signalservice.Content;

        /**
         * Creates a plain object from a Content message. Also converts values to other types if specified.
         * @param message Content
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.Content, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Content to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Content
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CallingMessage. */
    interface ICallingMessage {

        /** CallingMessage offer */
        offer?: (signalservice.CallingMessage.IOffer|null);

        /** CallingMessage answer */
        answer?: (signalservice.CallingMessage.IAnswer|null);

        /** CallingMessage iceCandidates */
        iceCandidates?: (signalservice.CallingMessage.IIceCandidate[]|null);

        /** CallingMessage busy */
        busy?: (signalservice.CallingMessage.IBusy|null);

        /** CallingMessage hangup */
        hangup?: (signalservice.CallingMessage.IHangup|null);

        /** CallingMessage destinationDeviceId */
        destinationDeviceId?: (number|null);

        /** CallingMessage opaque */
        opaque?: (signalservice.CallingMessage.IOpaque|null);
    }

    /** Represents a CallingMessage. */
    class CallingMessage implements ICallingMessage {

        /**
         * Constructs a new CallingMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.ICallingMessage);

        /** CallingMessage offer. */
        public offer?: (signalservice.CallingMessage.IOffer|null);

        /** CallingMessage answer. */
        public answer?: (signalservice.CallingMessage.IAnswer|null);

        /** CallingMessage iceCandidates. */
        public iceCandidates: signalservice.CallingMessage.IIceCandidate[];

        /** CallingMessage busy. */
        public busy?: (signalservice.CallingMessage.IBusy|null);

        /** CallingMessage hangup. */
        public hangup?: (signalservice.CallingMessage.IHangup|null);

        /** CallingMessage destinationDeviceId. */
        public destinationDeviceId: number;

        /** CallingMessage opaque. */
        public opaque?: (signalservice.CallingMessage.IOpaque|null);

        /**
         * Creates a new CallingMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CallingMessage instance
         */
        public static create(properties?: signalservice.ICallingMessage): signalservice.CallingMessage;

        /**
         * Encodes the specified CallingMessage message. Does not implicitly {@link signalservice.CallingMessage.verify|verify} messages.
         * @param message CallingMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.ICallingMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CallingMessage message, length delimited. Does not implicitly {@link signalservice.CallingMessage.verify|verify} messages.
         * @param message CallingMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.ICallingMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CallingMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CallingMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.CallingMessage;

        /**
         * Decodes a CallingMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CallingMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.CallingMessage;

        /**
         * Verifies a CallingMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CallingMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CallingMessage
         */
        public static fromObject(object: { [k: string]: any }): signalservice.CallingMessage;

        /**
         * Creates a plain object from a CallingMessage message. Also converts values to other types if specified.
         * @param message CallingMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.CallingMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CallingMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CallingMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace CallingMessage {

        /** Properties of an Offer. */
        interface IOffer {

            /** Offer callId */
            callId?: (number|Long|null);

            /** Offer type */
            type?: (signalservice.CallingMessage.Offer.Type|null);

            /** Offer opaque */
            opaque?: (Uint8Array|null);
        }

        /** Represents an Offer. */
        class Offer implements IOffer {

            /**
             * Constructs a new Offer.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.CallingMessage.IOffer);

            /** Offer callId. */
            public callId: (number|Long);

            /** Offer type. */
            public type: signalservice.CallingMessage.Offer.Type;

            /** Offer opaque. */
            public opaque: Uint8Array;

            /**
             * Creates a new Offer instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Offer instance
             */
            public static create(properties?: signalservice.CallingMessage.IOffer): signalservice.CallingMessage.Offer;

            /**
             * Encodes the specified Offer message. Does not implicitly {@link signalservice.CallingMessage.Offer.verify|verify} messages.
             * @param message Offer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.CallingMessage.IOffer, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Offer message, length delimited. Does not implicitly {@link signalservice.CallingMessage.Offer.verify|verify} messages.
             * @param message Offer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.CallingMessage.IOffer, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Offer message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Offer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.CallingMessage.Offer;

            /**
             * Decodes an Offer message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Offer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.CallingMessage.Offer;

            /**
             * Verifies an Offer message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Offer message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Offer
             */
            public static fromObject(object: { [k: string]: any }): signalservice.CallingMessage.Offer;

            /**
             * Creates a plain object from an Offer message. Also converts values to other types if specified.
             * @param message Offer
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.CallingMessage.Offer, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Offer to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Offer
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace Offer {

            /** Type enum. */
            enum Type {
                OFFER_AUDIO_CALL = 0,
                OFFER_VIDEO_CALL = 1
            }
        }

        /** Properties of an Answer. */
        interface IAnswer {

            /** Answer callId */
            callId?: (number|Long|null);

            /** Answer opaque */
            opaque?: (Uint8Array|null);
        }

        /** Represents an Answer. */
        class Answer implements IAnswer {

            /**
             * Constructs a new Answer.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.CallingMessage.IAnswer);

            /** Answer callId. */
            public callId: (number|Long);

            /** Answer opaque. */
            public opaque: Uint8Array;

            /**
             * Creates a new Answer instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Answer instance
             */
            public static create(properties?: signalservice.CallingMessage.IAnswer): signalservice.CallingMessage.Answer;

            /**
             * Encodes the specified Answer message. Does not implicitly {@link signalservice.CallingMessage.Answer.verify|verify} messages.
             * @param message Answer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.CallingMessage.IAnswer, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Answer message, length delimited. Does not implicitly {@link signalservice.CallingMessage.Answer.verify|verify} messages.
             * @param message Answer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.CallingMessage.IAnswer, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Answer message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Answer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.CallingMessage.Answer;

            /**
             * Decodes an Answer message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Answer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.CallingMessage.Answer;

            /**
             * Verifies an Answer message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Answer message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Answer
             */
            public static fromObject(object: { [k: string]: any }): signalservice.CallingMessage.Answer;

            /**
             * Creates a plain object from an Answer message. Also converts values to other types if specified.
             * @param message Answer
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.CallingMessage.Answer, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Answer to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Answer
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an IceCandidate. */
        interface IIceCandidate {

            /** IceCandidate callId */
            callId?: (number|Long|null);

            /** IceCandidate opaque */
            opaque?: (Uint8Array|null);
        }

        /** Represents an IceCandidate. */
        class IceCandidate implements IIceCandidate {

            /**
             * Constructs a new IceCandidate.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.CallingMessage.IIceCandidate);

            /** IceCandidate callId. */
            public callId: (number|Long);

            /** IceCandidate opaque. */
            public opaque: Uint8Array;

            /**
             * Creates a new IceCandidate instance using the specified properties.
             * @param [properties] Properties to set
             * @returns IceCandidate instance
             */
            public static create(properties?: signalservice.CallingMessage.IIceCandidate): signalservice.CallingMessage.IceCandidate;

            /**
             * Encodes the specified IceCandidate message. Does not implicitly {@link signalservice.CallingMessage.IceCandidate.verify|verify} messages.
             * @param message IceCandidate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.CallingMessage.IIceCandidate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified IceCandidate message, length delimited. Does not implicitly {@link signalservice.CallingMessage.IceCandidate.verify|verify} messages.
             * @param message IceCandidate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.CallingMessage.IIceCandidate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an IceCandidate message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns IceCandidate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.CallingMessage.IceCandidate;

            /**
             * Decodes an IceCandidate message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns IceCandidate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.CallingMessage.IceCandidate;

            /**
             * Verifies an IceCandidate message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an IceCandidate message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns IceCandidate
             */
            public static fromObject(object: { [k: string]: any }): signalservice.CallingMessage.IceCandidate;

            /**
             * Creates a plain object from an IceCandidate message. Also converts values to other types if specified.
             * @param message IceCandidate
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.CallingMessage.IceCandidate, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this IceCandidate to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for IceCandidate
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Busy. */
        interface IBusy {

            /** Busy callId */
            callId?: (number|Long|null);
        }

        /** Represents a Busy. */
        class Busy implements IBusy {

            /**
             * Constructs a new Busy.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.CallingMessage.IBusy);

            /** Busy callId. */
            public callId: (number|Long);

            /**
             * Creates a new Busy instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Busy instance
             */
            public static create(properties?: signalservice.CallingMessage.IBusy): signalservice.CallingMessage.Busy;

            /**
             * Encodes the specified Busy message. Does not implicitly {@link signalservice.CallingMessage.Busy.verify|verify} messages.
             * @param message Busy message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.CallingMessage.IBusy, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Busy message, length delimited. Does not implicitly {@link signalservice.CallingMessage.Busy.verify|verify} messages.
             * @param message Busy message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.CallingMessage.IBusy, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Busy message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Busy
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.CallingMessage.Busy;

            /**
             * Decodes a Busy message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Busy
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.CallingMessage.Busy;

            /**
             * Verifies a Busy message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Busy message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Busy
             */
            public static fromObject(object: { [k: string]: any }): signalservice.CallingMessage.Busy;

            /**
             * Creates a plain object from a Busy message. Also converts values to other types if specified.
             * @param message Busy
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.CallingMessage.Busy, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Busy to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Busy
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Hangup. */
        interface IHangup {

            /** Hangup callId */
            callId?: (number|Long|null);

            /** Hangup type */
            type?: (signalservice.CallingMessage.Hangup.Type|null);

            /** Hangup deviceId */
            deviceId?: (number|null);
        }

        /** Represents a Hangup. */
        class Hangup implements IHangup {

            /**
             * Constructs a new Hangup.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.CallingMessage.IHangup);

            /** Hangup callId. */
            public callId: (number|Long);

            /** Hangup type. */
            public type: signalservice.CallingMessage.Hangup.Type;

            /** Hangup deviceId. */
            public deviceId: number;

            /**
             * Creates a new Hangup instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Hangup instance
             */
            public static create(properties?: signalservice.CallingMessage.IHangup): signalservice.CallingMessage.Hangup;

            /**
             * Encodes the specified Hangup message. Does not implicitly {@link signalservice.CallingMessage.Hangup.verify|verify} messages.
             * @param message Hangup message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.CallingMessage.IHangup, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Hangup message, length delimited. Does not implicitly {@link signalservice.CallingMessage.Hangup.verify|verify} messages.
             * @param message Hangup message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.CallingMessage.IHangup, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Hangup message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Hangup
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.CallingMessage.Hangup;

            /**
             * Decodes a Hangup message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Hangup
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.CallingMessage.Hangup;

            /**
             * Verifies a Hangup message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Hangup message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Hangup
             */
            public static fromObject(object: { [k: string]: any }): signalservice.CallingMessage.Hangup;

            /**
             * Creates a plain object from a Hangup message. Also converts values to other types if specified.
             * @param message Hangup
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.CallingMessage.Hangup, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Hangup to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Hangup
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace Hangup {

            /** Type enum. */
            enum Type {
                HANGUP_NORMAL = 0,
                HANGUP_ACCEPTED = 1,
                HANGUP_DECLINED = 2,
                HANGUP_BUSY = 3,
                HANGUP_NEED_PERMISSION = 4
            }
        }

        /** Properties of an Opaque. */
        interface IOpaque {

            /** Opaque data */
            data?: (Uint8Array|null);

            /** Opaque urgency */
            urgency?: (signalservice.CallingMessage.Opaque.Urgency|null);
        }

        /** Represents an Opaque. */
        class Opaque implements IOpaque {

            /**
             * Constructs a new Opaque.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.CallingMessage.IOpaque);

            /** Opaque data. */
            public data: Uint8Array;

            /** Opaque urgency. */
            public urgency: signalservice.CallingMessage.Opaque.Urgency;

            /**
             * Creates a new Opaque instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Opaque instance
             */
            public static create(properties?: signalservice.CallingMessage.IOpaque): signalservice.CallingMessage.Opaque;

            /**
             * Encodes the specified Opaque message. Does not implicitly {@link signalservice.CallingMessage.Opaque.verify|verify} messages.
             * @param message Opaque message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.CallingMessage.IOpaque, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Opaque message, length delimited. Does not implicitly {@link signalservice.CallingMessage.Opaque.verify|verify} messages.
             * @param message Opaque message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.CallingMessage.IOpaque, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Opaque message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Opaque
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.CallingMessage.Opaque;

            /**
             * Decodes an Opaque message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Opaque
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.CallingMessage.Opaque;

            /**
             * Verifies an Opaque message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Opaque message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Opaque
             */
            public static fromObject(object: { [k: string]: any }): signalservice.CallingMessage.Opaque;

            /**
             * Creates a plain object from an Opaque message. Also converts values to other types if specified.
             * @param message Opaque
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.CallingMessage.Opaque, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Opaque to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Opaque
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace Opaque {

            /** Urgency enum. */
            enum Urgency {
                DROPPABLE = 0,
                HANDLE_IMMEDIATELY = 1
            }
        }
    }

    /** Properties of a DataMessage. */
    interface IDataMessage {

        /** DataMessage body */
        body?: (string|null);

        /** DataMessage attachments */
        attachments?: (signalservice.IAttachmentPointer[]|null);

        /** DataMessage groupV2 */
        groupV2?: (signalservice.IGroupContextV2|null);

        /** DataMessage flags */
        flags?: (number|null);

        /** DataMessage expireTimer */
        expireTimer?: (number|null);

        /** DataMessage profileKey */
        profileKey?: (Uint8Array|null);

        /** DataMessage timestamp */
        timestamp?: (number|Long|null);

        /** DataMessage quote */
        quote?: (signalservice.DataMessage.IQuote|null);

        /** DataMessage contact */
        contact?: (signalservice.DataMessage.IContact[]|null);

        /** DataMessage preview */
        preview?: (signalservice.DataMessage.IPreview[]|null);

        /** DataMessage sticker */
        sticker?: (signalservice.DataMessage.ISticker|null);

        /** DataMessage requiredProtocolVersion */
        requiredProtocolVersion?: (number|null);

        /** DataMessage isViewOnce */
        isViewOnce?: (boolean|null);

        /** DataMessage reaction */
        reaction?: (signalservice.DataMessage.IReaction|null);

        /** DataMessage delete */
        "delete"?: (signalservice.DataMessage.IDelete|null);

        /** DataMessage bodyRanges */
        bodyRanges?: (signalservice.DataMessage.IBodyRange[]|null);

        /** DataMessage groupCallUpdate */
        groupCallUpdate?: (signalservice.DataMessage.IGroupCallUpdate|null);

        /** DataMessage payment */
        payment?: (signalservice.DataMessage.IPayment|null);

        /** DataMessage storyContext */
        storyContext?: (signalservice.DataMessage.IStoryContext|null);

        /** DataMessage giftBadge */
        giftBadge?: (signalservice.DataMessage.IGiftBadge|null);
    }

    /** Represents a DataMessage. */
    class DataMessage implements IDataMessage {

        /**
         * Constructs a new DataMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IDataMessage);

        /** DataMessage body. */
        public body: string;

        /** DataMessage attachments. */
        public attachments: signalservice.IAttachmentPointer[];

        /** DataMessage groupV2. */
        public groupV2?: (signalservice.IGroupContextV2|null);

        /** DataMessage flags. */
        public flags: number;

        /** DataMessage expireTimer. */
        public expireTimer: number;

        /** DataMessage profileKey. */
        public profileKey: Uint8Array;

        /** DataMessage timestamp. */
        public timestamp: (number|Long);

        /** DataMessage quote. */
        public quote?: (signalservice.DataMessage.IQuote|null);

        /** DataMessage contact. */
        public contact: signalservice.DataMessage.IContact[];

        /** DataMessage preview. */
        public preview: signalservice.DataMessage.IPreview[];

        /** DataMessage sticker. */
        public sticker?: (signalservice.DataMessage.ISticker|null);

        /** DataMessage requiredProtocolVersion. */
        public requiredProtocolVersion: number;

        /** DataMessage isViewOnce. */
        public isViewOnce: boolean;

        /** DataMessage reaction. */
        public reaction?: (signalservice.DataMessage.IReaction|null);

        /** DataMessage delete. */
        public delete?: (signalservice.DataMessage.IDelete|null);

        /** DataMessage bodyRanges. */
        public bodyRanges: signalservice.DataMessage.IBodyRange[];

        /** DataMessage groupCallUpdate. */
        public groupCallUpdate?: (signalservice.DataMessage.IGroupCallUpdate|null);

        /** DataMessage payment. */
        public payment?: (signalservice.DataMessage.IPayment|null);

        /** DataMessage storyContext. */
        public storyContext?: (signalservice.DataMessage.IStoryContext|null);

        /** DataMessage giftBadge. */
        public giftBadge?: (signalservice.DataMessage.IGiftBadge|null);

        /**
         * Creates a new DataMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DataMessage instance
         */
        public static create(properties?: signalservice.IDataMessage): signalservice.DataMessage;

        /**
         * Encodes the specified DataMessage message. Does not implicitly {@link signalservice.DataMessage.verify|verify} messages.
         * @param message DataMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IDataMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DataMessage message, length delimited. Does not implicitly {@link signalservice.DataMessage.verify|verify} messages.
         * @param message DataMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IDataMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DataMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DataMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage;

        /**
         * Decodes a DataMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DataMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage;

        /**
         * Verifies a DataMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DataMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DataMessage
         */
        public static fromObject(object: { [k: string]: any }): signalservice.DataMessage;

        /**
         * Creates a plain object from a DataMessage message. Also converts values to other types if specified.
         * @param message DataMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.DataMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DataMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DataMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace DataMessage {

        /** Flags enum. */
        enum Flags {
            END_SESSION = 1,
            EXPIRATION_TIMER_UPDATE = 2,
            PROFILE_KEY_UPDATE = 4
        }

        /** Properties of a Payment. */
        interface IPayment {

            /** Payment notification */
            notification?: (signalservice.DataMessage.Payment.INotification|null);

            /** Payment activation */
            activation?: (signalservice.DataMessage.Payment.IActivation|null);

            /** Payment request */
            request?: (signalservice.DataMessage.Payment.IRequest|null);

            /** Payment cancellation */
            cancellation?: (signalservice.DataMessage.Payment.ICancellation|null);
        }

        /** Represents a Payment. */
        class Payment implements IPayment {

            /**
             * Constructs a new Payment.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.DataMessage.IPayment);

            /** Payment notification. */
            public notification?: (signalservice.DataMessage.Payment.INotification|null);

            /** Payment activation. */
            public activation?: (signalservice.DataMessage.Payment.IActivation|null);

            /** Payment request. */
            public request?: (signalservice.DataMessage.Payment.IRequest|null);

            /** Payment cancellation. */
            public cancellation?: (signalservice.DataMessage.Payment.ICancellation|null);

            /** Payment Item. */
            public Item?: ("notification"|"activation"|"request"|"cancellation");

            /**
             * Creates a new Payment instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Payment instance
             */
            public static create(properties?: signalservice.DataMessage.IPayment): signalservice.DataMessage.Payment;

            /**
             * Encodes the specified Payment message. Does not implicitly {@link signalservice.DataMessage.Payment.verify|verify} messages.
             * @param message Payment message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.DataMessage.IPayment, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Payment message, length delimited. Does not implicitly {@link signalservice.DataMessage.Payment.verify|verify} messages.
             * @param message Payment message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.DataMessage.IPayment, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Payment message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Payment
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Payment;

            /**
             * Decodes a Payment message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Payment
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Payment;

            /**
             * Verifies a Payment message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Payment message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Payment
             */
            public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Payment;

            /**
             * Creates a plain object from a Payment message. Also converts values to other types if specified.
             * @param message Payment
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.DataMessage.Payment, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Payment to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Payment
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace Payment {

            /** Properties of an Amount. */
            interface IAmount {

                /** Amount mobileCoin */
                mobileCoin?: (signalservice.DataMessage.Payment.Amount.IMobileCoin|null);
            }

            /** Represents an Amount. */
            class Amount implements IAmount {

                /**
                 * Constructs a new Amount.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.DataMessage.Payment.IAmount);

                /** Amount mobileCoin. */
                public mobileCoin?: (signalservice.DataMessage.Payment.Amount.IMobileCoin|null);

                /** Amount Amount. */
                public Amount?: "mobileCoin";

                /**
                 * Creates a new Amount instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Amount instance
                 */
                public static create(properties?: signalservice.DataMessage.Payment.IAmount): signalservice.DataMessage.Payment.Amount;

                /**
                 * Encodes the specified Amount message. Does not implicitly {@link signalservice.DataMessage.Payment.Amount.verify|verify} messages.
                 * @param message Amount message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.DataMessage.Payment.IAmount, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Amount message, length delimited. Does not implicitly {@link signalservice.DataMessage.Payment.Amount.verify|verify} messages.
                 * @param message Amount message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.DataMessage.Payment.IAmount, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Amount message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Amount
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Payment.Amount;

                /**
                 * Decodes an Amount message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Amount
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Payment.Amount;

                /**
                 * Verifies an Amount message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Amount message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Amount
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Payment.Amount;

                /**
                 * Creates a plain object from an Amount message. Also converts values to other types if specified.
                 * @param message Amount
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.DataMessage.Payment.Amount, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Amount to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Amount
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace Amount {

                /** Properties of a MobileCoin. */
                interface IMobileCoin {

                    /** MobileCoin picoMob */
                    picoMob?: (number|Long|null);
                }

                /** Represents a MobileCoin. */
                class MobileCoin implements IMobileCoin {

                    /**
                     * Constructs a new MobileCoin.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: signalservice.DataMessage.Payment.Amount.IMobileCoin);

                    /** MobileCoin picoMob. */
                    public picoMob: (number|Long);

                    /**
                     * Creates a new MobileCoin instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns MobileCoin instance
                     */
                    public static create(properties?: signalservice.DataMessage.Payment.Amount.IMobileCoin): signalservice.DataMessage.Payment.Amount.MobileCoin;

                    /**
                     * Encodes the specified MobileCoin message. Does not implicitly {@link signalservice.DataMessage.Payment.Amount.MobileCoin.verify|verify} messages.
                     * @param message MobileCoin message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: signalservice.DataMessage.Payment.Amount.IMobileCoin, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified MobileCoin message, length delimited. Does not implicitly {@link signalservice.DataMessage.Payment.Amount.MobileCoin.verify|verify} messages.
                     * @param message MobileCoin message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: signalservice.DataMessage.Payment.Amount.IMobileCoin, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a MobileCoin message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns MobileCoin
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Payment.Amount.MobileCoin;

                    /**
                     * Decodes a MobileCoin message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns MobileCoin
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Payment.Amount.MobileCoin;

                    /**
                     * Verifies a MobileCoin message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a MobileCoin message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns MobileCoin
                     */
                    public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Payment.Amount.MobileCoin;

                    /**
                     * Creates a plain object from a MobileCoin message. Also converts values to other types if specified.
                     * @param message MobileCoin
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: signalservice.DataMessage.Payment.Amount.MobileCoin, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this MobileCoin to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for MobileCoin
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }
            }

            /** Properties of a RequestId. */
            interface IRequestId {

                /** RequestId uuid */
                uuid?: (string|null);
            }

            /** Represents a RequestId. */
            class RequestId implements IRequestId {

                /**
                 * Constructs a new RequestId.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.DataMessage.Payment.IRequestId);

                /** RequestId uuid. */
                public uuid: string;

                /**
                 * Creates a new RequestId instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns RequestId instance
                 */
                public static create(properties?: signalservice.DataMessage.Payment.IRequestId): signalservice.DataMessage.Payment.RequestId;

                /**
                 * Encodes the specified RequestId message. Does not implicitly {@link signalservice.DataMessage.Payment.RequestId.verify|verify} messages.
                 * @param message RequestId message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.DataMessage.Payment.IRequestId, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified RequestId message, length delimited. Does not implicitly {@link signalservice.DataMessage.Payment.RequestId.verify|verify} messages.
                 * @param message RequestId message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.DataMessage.Payment.IRequestId, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a RequestId message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns RequestId
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Payment.RequestId;

                /**
                 * Decodes a RequestId message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns RequestId
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Payment.RequestId;

                /**
                 * Verifies a RequestId message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a RequestId message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns RequestId
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Payment.RequestId;

                /**
                 * Creates a plain object from a RequestId message. Also converts values to other types if specified.
                 * @param message RequestId
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.DataMessage.Payment.RequestId, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this RequestId to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for RequestId
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Request. */
            interface IRequest {

                /** Request requestId */
                requestId?: (signalservice.DataMessage.Payment.IRequestId|null);

                /** Request amount */
                amount?: (signalservice.DataMessage.Payment.IAmount|null);

                /** Request note */
                note?: (string|null);
            }

            /** Represents a Request. */
            class Request implements IRequest {

                /**
                 * Constructs a new Request.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.DataMessage.Payment.IRequest);

                /** Request requestId. */
                public requestId?: (signalservice.DataMessage.Payment.IRequestId|null);

                /** Request amount. */
                public amount?: (signalservice.DataMessage.Payment.IAmount|null);

                /** Request note. */
                public note: string;

                /**
                 * Creates a new Request instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Request instance
                 */
                public static create(properties?: signalservice.DataMessage.Payment.IRequest): signalservice.DataMessage.Payment.Request;

                /**
                 * Encodes the specified Request message. Does not implicitly {@link signalservice.DataMessage.Payment.Request.verify|verify} messages.
                 * @param message Request message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.DataMessage.Payment.IRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Request message, length delimited. Does not implicitly {@link signalservice.DataMessage.Payment.Request.verify|verify} messages.
                 * @param message Request message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.DataMessage.Payment.IRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Request message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Request
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Payment.Request;

                /**
                 * Decodes a Request message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Request
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Payment.Request;

                /**
                 * Verifies a Request message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Request message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Request
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Payment.Request;

                /**
                 * Creates a plain object from a Request message. Also converts values to other types if specified.
                 * @param message Request
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.DataMessage.Payment.Request, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Request to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Request
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Notification. */
            interface INotification {

                /** Notification mobileCoin */
                mobileCoin?: (signalservice.DataMessage.Payment.Notification.IMobileCoin|null);

                /** Notification note */
                note?: (string|null);

                /** Notification requestId */
                requestId?: (signalservice.DataMessage.Payment.IRequestId|null);
            }

            /** Represents a Notification. */
            class Notification implements INotification {

                /**
                 * Constructs a new Notification.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.DataMessage.Payment.INotification);

                /** Notification mobileCoin. */
                public mobileCoin?: (signalservice.DataMessage.Payment.Notification.IMobileCoin|null);

                /** Notification note. */
                public note: string;

                /** Notification requestId. */
                public requestId?: (signalservice.DataMessage.Payment.IRequestId|null);

                /** Notification Transaction. */
                public Transaction?: "mobileCoin";

                /**
                 * Creates a new Notification instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Notification instance
                 */
                public static create(properties?: signalservice.DataMessage.Payment.INotification): signalservice.DataMessage.Payment.Notification;

                /**
                 * Encodes the specified Notification message. Does not implicitly {@link signalservice.DataMessage.Payment.Notification.verify|verify} messages.
                 * @param message Notification message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.DataMessage.Payment.INotification, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Notification message, length delimited. Does not implicitly {@link signalservice.DataMessage.Payment.Notification.verify|verify} messages.
                 * @param message Notification message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.DataMessage.Payment.INotification, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Notification message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Notification
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Payment.Notification;

                /**
                 * Decodes a Notification message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Notification
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Payment.Notification;

                /**
                 * Verifies a Notification message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Notification message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Notification
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Payment.Notification;

                /**
                 * Creates a plain object from a Notification message. Also converts values to other types if specified.
                 * @param message Notification
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.DataMessage.Payment.Notification, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Notification to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Notification
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace Notification {

                /** Properties of a MobileCoin. */
                interface IMobileCoin {

                    /** MobileCoin receipt */
                    receipt?: (Uint8Array|null);
                }

                /** Represents a MobileCoin. */
                class MobileCoin implements IMobileCoin {

                    /**
                     * Constructs a new MobileCoin.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: signalservice.DataMessage.Payment.Notification.IMobileCoin);

                    /** MobileCoin receipt. */
                    public receipt: Uint8Array;

                    /**
                     * Creates a new MobileCoin instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns MobileCoin instance
                     */
                    public static create(properties?: signalservice.DataMessage.Payment.Notification.IMobileCoin): signalservice.DataMessage.Payment.Notification.MobileCoin;

                    /**
                     * Encodes the specified MobileCoin message. Does not implicitly {@link signalservice.DataMessage.Payment.Notification.MobileCoin.verify|verify} messages.
                     * @param message MobileCoin message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: signalservice.DataMessage.Payment.Notification.IMobileCoin, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified MobileCoin message, length delimited. Does not implicitly {@link signalservice.DataMessage.Payment.Notification.MobileCoin.verify|verify} messages.
                     * @param message MobileCoin message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: signalservice.DataMessage.Payment.Notification.IMobileCoin, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a MobileCoin message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns MobileCoin
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Payment.Notification.MobileCoin;

                    /**
                     * Decodes a MobileCoin message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns MobileCoin
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Payment.Notification.MobileCoin;

                    /**
                     * Verifies a MobileCoin message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a MobileCoin message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns MobileCoin
                     */
                    public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Payment.Notification.MobileCoin;

                    /**
                     * Creates a plain object from a MobileCoin message. Also converts values to other types if specified.
                     * @param message MobileCoin
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: signalservice.DataMessage.Payment.Notification.MobileCoin, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this MobileCoin to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for MobileCoin
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }
            }

            /** Properties of a Cancellation. */
            interface ICancellation {

                /** Cancellation requestId */
                requestId?: (signalservice.DataMessage.Payment.IRequestId|null);
            }

            /** Represents a Cancellation. */
            class Cancellation implements ICancellation {

                /**
                 * Constructs a new Cancellation.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.DataMessage.Payment.ICancellation);

                /** Cancellation requestId. */
                public requestId?: (signalservice.DataMessage.Payment.IRequestId|null);

                /**
                 * Creates a new Cancellation instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Cancellation instance
                 */
                public static create(properties?: signalservice.DataMessage.Payment.ICancellation): signalservice.DataMessage.Payment.Cancellation;

                /**
                 * Encodes the specified Cancellation message. Does not implicitly {@link signalservice.DataMessage.Payment.Cancellation.verify|verify} messages.
                 * @param message Cancellation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.DataMessage.Payment.ICancellation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Cancellation message, length delimited. Does not implicitly {@link signalservice.DataMessage.Payment.Cancellation.verify|verify} messages.
                 * @param message Cancellation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.DataMessage.Payment.ICancellation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Cancellation message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Cancellation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Payment.Cancellation;

                /**
                 * Decodes a Cancellation message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Cancellation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Payment.Cancellation;

                /**
                 * Verifies a Cancellation message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Cancellation message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Cancellation
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Payment.Cancellation;

                /**
                 * Creates a plain object from a Cancellation message. Also converts values to other types if specified.
                 * @param message Cancellation
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.DataMessage.Payment.Cancellation, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Cancellation to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Cancellation
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an Activation. */
            interface IActivation {

                /** Activation type */
                type?: (signalservice.DataMessage.Payment.Activation.Type|null);
            }

            /** Represents an Activation. */
            class Activation implements IActivation {

                /**
                 * Constructs a new Activation.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.DataMessage.Payment.IActivation);

                /** Activation type. */
                public type: signalservice.DataMessage.Payment.Activation.Type;

                /**
                 * Creates a new Activation instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Activation instance
                 */
                public static create(properties?: signalservice.DataMessage.Payment.IActivation): signalservice.DataMessage.Payment.Activation;

                /**
                 * Encodes the specified Activation message. Does not implicitly {@link signalservice.DataMessage.Payment.Activation.verify|verify} messages.
                 * @param message Activation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.DataMessage.Payment.IActivation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Activation message, length delimited. Does not implicitly {@link signalservice.DataMessage.Payment.Activation.verify|verify} messages.
                 * @param message Activation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.DataMessage.Payment.IActivation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Activation message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Activation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Payment.Activation;

                /**
                 * Decodes an Activation message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Activation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Payment.Activation;

                /**
                 * Verifies an Activation message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Activation message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Activation
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Payment.Activation;

                /**
                 * Creates a plain object from an Activation message. Also converts values to other types if specified.
                 * @param message Activation
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.DataMessage.Payment.Activation, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Activation to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Activation
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace Activation {

                /** Type enum. */
                enum Type {
                    REQUEST = 0,
                    ACTIVATED = 1
                }
            }
        }

        /** Properties of a Quote. */
        interface IQuote {

            /** Quote id */
            id?: (number|Long|null);

            /** Quote authorAci */
            authorAci?: (string|null);

            /** Quote text */
            text?: (string|null);

            /** Quote attachments */
            attachments?: (signalservice.DataMessage.Quote.IQuotedAttachment[]|null);

            /** Quote bodyRanges */
            bodyRanges?: (signalservice.DataMessage.IBodyRange[]|null);

            /** Quote type */
            type?: (signalservice.DataMessage.Quote.Type|null);
        }

        /** Represents a Quote. */
        class Quote implements IQuote {

            /**
             * Constructs a new Quote.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.DataMessage.IQuote);

            /** Quote id. */
            public id: (number|Long);

            /** Quote authorAci. */
            public authorAci: string;

            /** Quote text. */
            public text: string;

            /** Quote attachments. */
            public attachments: signalservice.DataMessage.Quote.IQuotedAttachment[];

            /** Quote bodyRanges. */
            public bodyRanges: signalservice.DataMessage.IBodyRange[];

            /** Quote type. */
            public type: signalservice.DataMessage.Quote.Type;

            /**
             * Creates a new Quote instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Quote instance
             */
            public static create(properties?: signalservice.DataMessage.IQuote): signalservice.DataMessage.Quote;

            /**
             * Encodes the specified Quote message. Does not implicitly {@link signalservice.DataMessage.Quote.verify|verify} messages.
             * @param message Quote message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.DataMessage.IQuote, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Quote message, length delimited. Does not implicitly {@link signalservice.DataMessage.Quote.verify|verify} messages.
             * @param message Quote message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.DataMessage.IQuote, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Quote message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Quote
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Quote;

            /**
             * Decodes a Quote message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Quote
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Quote;

            /**
             * Verifies a Quote message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Quote message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Quote
             */
            public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Quote;

            /**
             * Creates a plain object from a Quote message. Also converts values to other types if specified.
             * @param message Quote
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.DataMessage.Quote, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Quote to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Quote
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace Quote {

            /** Type enum. */
            enum Type {
                NORMAL = 0,
                GIFT_BADGE = 1
            }

            /** Properties of a QuotedAttachment. */
            interface IQuotedAttachment {

                /** QuotedAttachment contentType */
                contentType?: (string|null);

                /** QuotedAttachment fileName */
                fileName?: (string|null);

                /** QuotedAttachment thumbnail */
                thumbnail?: (signalservice.IAttachmentPointer|null);
            }

            /** Represents a QuotedAttachment. */
            class QuotedAttachment implements IQuotedAttachment {

                /**
                 * Constructs a new QuotedAttachment.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.DataMessage.Quote.IQuotedAttachment);

                /** QuotedAttachment contentType. */
                public contentType: string;

                /** QuotedAttachment fileName. */
                public fileName: string;

                /** QuotedAttachment thumbnail. */
                public thumbnail?: (signalservice.IAttachmentPointer|null);

                /**
                 * Creates a new QuotedAttachment instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns QuotedAttachment instance
                 */
                public static create(properties?: signalservice.DataMessage.Quote.IQuotedAttachment): signalservice.DataMessage.Quote.QuotedAttachment;

                /**
                 * Encodes the specified QuotedAttachment message. Does not implicitly {@link signalservice.DataMessage.Quote.QuotedAttachment.verify|verify} messages.
                 * @param message QuotedAttachment message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.DataMessage.Quote.IQuotedAttachment, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified QuotedAttachment message, length delimited. Does not implicitly {@link signalservice.DataMessage.Quote.QuotedAttachment.verify|verify} messages.
                 * @param message QuotedAttachment message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.DataMessage.Quote.IQuotedAttachment, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a QuotedAttachment message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns QuotedAttachment
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Quote.QuotedAttachment;

                /**
                 * Decodes a QuotedAttachment message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns QuotedAttachment
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Quote.QuotedAttachment;

                /**
                 * Verifies a QuotedAttachment message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a QuotedAttachment message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns QuotedAttachment
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Quote.QuotedAttachment;

                /**
                 * Creates a plain object from a QuotedAttachment message. Also converts values to other types if specified.
                 * @param message QuotedAttachment
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.DataMessage.Quote.QuotedAttachment, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this QuotedAttachment to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for QuotedAttachment
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a Contact. */
        interface IContact {

            /** Contact name */
            name?: (signalservice.DataMessage.Contact.IName|null);

            /** Contact number */
            number?: (signalservice.DataMessage.Contact.IPhone[]|null);

            /** Contact email */
            email?: (signalservice.DataMessage.Contact.IEmail[]|null);

            /** Contact address */
            address?: (signalservice.DataMessage.Contact.IPostalAddress[]|null);

            /** Contact avatar */
            avatar?: (signalservice.DataMessage.Contact.IAvatar|null);

            /** Contact organization */
            organization?: (string|null);
        }

        /** Represents a Contact. */
        class Contact implements IContact {

            /**
             * Constructs a new Contact.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.DataMessage.IContact);

            /** Contact name. */
            public name?: (signalservice.DataMessage.Contact.IName|null);

            /** Contact number. */
            public number: signalservice.DataMessage.Contact.IPhone[];

            /** Contact email. */
            public email: signalservice.DataMessage.Contact.IEmail[];

            /** Contact address. */
            public address: signalservice.DataMessage.Contact.IPostalAddress[];

            /** Contact avatar. */
            public avatar?: (signalservice.DataMessage.Contact.IAvatar|null);

            /** Contact organization. */
            public organization: string;

            /**
             * Creates a new Contact instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Contact instance
             */
            public static create(properties?: signalservice.DataMessage.IContact): signalservice.DataMessage.Contact;

            /**
             * Encodes the specified Contact message. Does not implicitly {@link signalservice.DataMessage.Contact.verify|verify} messages.
             * @param message Contact message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.DataMessage.IContact, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Contact message, length delimited. Does not implicitly {@link signalservice.DataMessage.Contact.verify|verify} messages.
             * @param message Contact message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.DataMessage.IContact, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Contact message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Contact
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Contact;

            /**
             * Decodes a Contact message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Contact
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Contact;

            /**
             * Verifies a Contact message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Contact message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Contact
             */
            public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Contact;

            /**
             * Creates a plain object from a Contact message. Also converts values to other types if specified.
             * @param message Contact
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.DataMessage.Contact, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Contact to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Contact
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace Contact {

            /** Properties of a Name. */
            interface IName {

                /** Name givenName */
                givenName?: (string|null);

                /** Name familyName */
                familyName?: (string|null);

                /** Name prefix */
                prefix?: (string|null);

                /** Name suffix */
                suffix?: (string|null);

                /** Name middleName */
                middleName?: (string|null);

                /** Name displayName */
                displayName?: (string|null);
            }

            /** Represents a Name. */
            class Name implements IName {

                /**
                 * Constructs a new Name.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.DataMessage.Contact.IName);

                /** Name givenName. */
                public givenName: string;

                /** Name familyName. */
                public familyName: string;

                /** Name prefix. */
                public prefix: string;

                /** Name suffix. */
                public suffix: string;

                /** Name middleName. */
                public middleName: string;

                /** Name displayName. */
                public displayName: string;

                /**
                 * Creates a new Name instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Name instance
                 */
                public static create(properties?: signalservice.DataMessage.Contact.IName): signalservice.DataMessage.Contact.Name;

                /**
                 * Encodes the specified Name message. Does not implicitly {@link signalservice.DataMessage.Contact.Name.verify|verify} messages.
                 * @param message Name message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.DataMessage.Contact.IName, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Name message, length delimited. Does not implicitly {@link signalservice.DataMessage.Contact.Name.verify|verify} messages.
                 * @param message Name message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.DataMessage.Contact.IName, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Name message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Name
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Contact.Name;

                /**
                 * Decodes a Name message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Name
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Contact.Name;

                /**
                 * Verifies a Name message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Name message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Name
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Contact.Name;

                /**
                 * Creates a plain object from a Name message. Also converts values to other types if specified.
                 * @param message Name
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.DataMessage.Contact.Name, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Name to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Name
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Phone. */
            interface IPhone {

                /** Phone value */
                value?: (string|null);

                /** Phone type */
                type?: (signalservice.DataMessage.Contact.Phone.Type|null);

                /** Phone label */
                label?: (string|null);
            }

            /** Represents a Phone. */
            class Phone implements IPhone {

                /**
                 * Constructs a new Phone.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.DataMessage.Contact.IPhone);

                /** Phone value. */
                public value: string;

                /** Phone type. */
                public type: signalservice.DataMessage.Contact.Phone.Type;

                /** Phone label. */
                public label: string;

                /**
                 * Creates a new Phone instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Phone instance
                 */
                public static create(properties?: signalservice.DataMessage.Contact.IPhone): signalservice.DataMessage.Contact.Phone;

                /**
                 * Encodes the specified Phone message. Does not implicitly {@link signalservice.DataMessage.Contact.Phone.verify|verify} messages.
                 * @param message Phone message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.DataMessage.Contact.IPhone, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Phone message, length delimited. Does not implicitly {@link signalservice.DataMessage.Contact.Phone.verify|verify} messages.
                 * @param message Phone message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.DataMessage.Contact.IPhone, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Phone message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Phone
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Contact.Phone;

                /**
                 * Decodes a Phone message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Phone
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Contact.Phone;

                /**
                 * Verifies a Phone message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Phone message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Phone
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Contact.Phone;

                /**
                 * Creates a plain object from a Phone message. Also converts values to other types if specified.
                 * @param message Phone
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.DataMessage.Contact.Phone, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Phone to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Phone
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace Phone {

                /** Type enum. */
                enum Type {
                    HOME = 1,
                    MOBILE = 2,
                    WORK = 3,
                    CUSTOM = 4
                }
            }

            /** Properties of an Email. */
            interface IEmail {

                /** Email value */
                value?: (string|null);

                /** Email type */
                type?: (signalservice.DataMessage.Contact.Email.Type|null);

                /** Email label */
                label?: (string|null);
            }

            /** Represents an Email. */
            class Email implements IEmail {

                /**
                 * Constructs a new Email.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.DataMessage.Contact.IEmail);

                /** Email value. */
                public value: string;

                /** Email type. */
                public type: signalservice.DataMessage.Contact.Email.Type;

                /** Email label. */
                public label: string;

                /**
                 * Creates a new Email instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Email instance
                 */
                public static create(properties?: signalservice.DataMessage.Contact.IEmail): signalservice.DataMessage.Contact.Email;

                /**
                 * Encodes the specified Email message. Does not implicitly {@link signalservice.DataMessage.Contact.Email.verify|verify} messages.
                 * @param message Email message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.DataMessage.Contact.IEmail, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Email message, length delimited. Does not implicitly {@link signalservice.DataMessage.Contact.Email.verify|verify} messages.
                 * @param message Email message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.DataMessage.Contact.IEmail, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Email message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Email
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Contact.Email;

                /**
                 * Decodes an Email message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Email
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Contact.Email;

                /**
                 * Verifies an Email message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Email message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Email
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Contact.Email;

                /**
                 * Creates a plain object from an Email message. Also converts values to other types if specified.
                 * @param message Email
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.DataMessage.Contact.Email, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Email to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Email
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace Email {

                /** Type enum. */
                enum Type {
                    HOME = 1,
                    MOBILE = 2,
                    WORK = 3,
                    CUSTOM = 4
                }
            }

            /** Properties of a PostalAddress. */
            interface IPostalAddress {

                /** PostalAddress type */
                type?: (signalservice.DataMessage.Contact.PostalAddress.Type|null);

                /** PostalAddress label */
                label?: (string|null);

                /** PostalAddress street */
                street?: (string|null);

                /** PostalAddress pobox */
                pobox?: (string|null);

                /** PostalAddress neighborhood */
                neighborhood?: (string|null);

                /** PostalAddress city */
                city?: (string|null);

                /** PostalAddress region */
                region?: (string|null);

                /** PostalAddress postcode */
                postcode?: (string|null);

                /** PostalAddress country */
                country?: (string|null);
            }

            /** Represents a PostalAddress. */
            class PostalAddress implements IPostalAddress {

                /**
                 * Constructs a new PostalAddress.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.DataMessage.Contact.IPostalAddress);

                /** PostalAddress type. */
                public type: signalservice.DataMessage.Contact.PostalAddress.Type;

                /** PostalAddress label. */
                public label: string;

                /** PostalAddress street. */
                public street: string;

                /** PostalAddress pobox. */
                public pobox: string;

                /** PostalAddress neighborhood. */
                public neighborhood: string;

                /** PostalAddress city. */
                public city: string;

                /** PostalAddress region. */
                public region: string;

                /** PostalAddress postcode. */
                public postcode: string;

                /** PostalAddress country. */
                public country: string;

                /**
                 * Creates a new PostalAddress instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PostalAddress instance
                 */
                public static create(properties?: signalservice.DataMessage.Contact.IPostalAddress): signalservice.DataMessage.Contact.PostalAddress;

                /**
                 * Encodes the specified PostalAddress message. Does not implicitly {@link signalservice.DataMessage.Contact.PostalAddress.verify|verify} messages.
                 * @param message PostalAddress message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.DataMessage.Contact.IPostalAddress, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PostalAddress message, length delimited. Does not implicitly {@link signalservice.DataMessage.Contact.PostalAddress.verify|verify} messages.
                 * @param message PostalAddress message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.DataMessage.Contact.IPostalAddress, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PostalAddress message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PostalAddress
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Contact.PostalAddress;

                /**
                 * Decodes a PostalAddress message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PostalAddress
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Contact.PostalAddress;

                /**
                 * Verifies a PostalAddress message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PostalAddress message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PostalAddress
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Contact.PostalAddress;

                /**
                 * Creates a plain object from a PostalAddress message. Also converts values to other types if specified.
                 * @param message PostalAddress
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.DataMessage.Contact.PostalAddress, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PostalAddress to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PostalAddress
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace PostalAddress {

                /** Type enum. */
                enum Type {
                    HOME = 1,
                    WORK = 2,
                    CUSTOM = 3
                }
            }

            /** Properties of an Avatar. */
            interface IAvatar {

                /** Avatar avatar */
                avatar?: (signalservice.IAttachmentPointer|null);

                /** Avatar isProfile */
                isProfile?: (boolean|null);
            }

            /** Represents an Avatar. */
            class Avatar implements IAvatar {

                /**
                 * Constructs a new Avatar.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.DataMessage.Contact.IAvatar);

                /** Avatar avatar. */
                public avatar?: (signalservice.IAttachmentPointer|null);

                /** Avatar isProfile. */
                public isProfile: boolean;

                /**
                 * Creates a new Avatar instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Avatar instance
                 */
                public static create(properties?: signalservice.DataMessage.Contact.IAvatar): signalservice.DataMessage.Contact.Avatar;

                /**
                 * Encodes the specified Avatar message. Does not implicitly {@link signalservice.DataMessage.Contact.Avatar.verify|verify} messages.
                 * @param message Avatar message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.DataMessage.Contact.IAvatar, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Avatar message, length delimited. Does not implicitly {@link signalservice.DataMessage.Contact.Avatar.verify|verify} messages.
                 * @param message Avatar message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.DataMessage.Contact.IAvatar, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Avatar message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Avatar
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Contact.Avatar;

                /**
                 * Decodes an Avatar message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Avatar
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Contact.Avatar;

                /**
                 * Verifies an Avatar message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Avatar message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Avatar
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Contact.Avatar;

                /**
                 * Creates a plain object from an Avatar message. Also converts values to other types if specified.
                 * @param message Avatar
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.DataMessage.Contact.Avatar, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Avatar to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Avatar
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a Preview. */
        interface IPreview {

            /** Preview url */
            url?: (string|null);

            /** Preview title */
            title?: (string|null);

            /** Preview image */
            image?: (signalservice.IAttachmentPointer|null);

            /** Preview description */
            description?: (string|null);

            /** Preview date */
            date?: (number|Long|null);
        }

        /** Represents a Preview. */
        class Preview implements IPreview {

            /**
             * Constructs a new Preview.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.DataMessage.IPreview);

            /** Preview url. */
            public url: string;

            /** Preview title. */
            public title: string;

            /** Preview image. */
            public image?: (signalservice.IAttachmentPointer|null);

            /** Preview description. */
            public description: string;

            /** Preview date. */
            public date: (number|Long);

            /**
             * Creates a new Preview instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Preview instance
             */
            public static create(properties?: signalservice.DataMessage.IPreview): signalservice.DataMessage.Preview;

            /**
             * Encodes the specified Preview message. Does not implicitly {@link signalservice.DataMessage.Preview.verify|verify} messages.
             * @param message Preview message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.DataMessage.IPreview, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Preview message, length delimited. Does not implicitly {@link signalservice.DataMessage.Preview.verify|verify} messages.
             * @param message Preview message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.DataMessage.IPreview, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Preview message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Preview
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Preview;

            /**
             * Decodes a Preview message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Preview
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Preview;

            /**
             * Verifies a Preview message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Preview message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Preview
             */
            public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Preview;

            /**
             * Creates a plain object from a Preview message. Also converts values to other types if specified.
             * @param message Preview
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.DataMessage.Preview, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Preview to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Preview
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Sticker. */
        interface ISticker {

            /** Sticker packId */
            packId?: (Uint8Array|null);

            /** Sticker packKey */
            packKey?: (Uint8Array|null);

            /** Sticker stickerId */
            stickerId?: (number|null);

            /** Sticker data */
            data?: (signalservice.IAttachmentPointer|null);

            /** Sticker emoji */
            emoji?: (string|null);
        }

        /** Represents a Sticker. */
        class Sticker implements ISticker {

            /**
             * Constructs a new Sticker.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.DataMessage.ISticker);

            /** Sticker packId. */
            public packId: Uint8Array;

            /** Sticker packKey. */
            public packKey: Uint8Array;

            /** Sticker stickerId. */
            public stickerId: number;

            /** Sticker data. */
            public data?: (signalservice.IAttachmentPointer|null);

            /** Sticker emoji. */
            public emoji: string;

            /**
             * Creates a new Sticker instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Sticker instance
             */
            public static create(properties?: signalservice.DataMessage.ISticker): signalservice.DataMessage.Sticker;

            /**
             * Encodes the specified Sticker message. Does not implicitly {@link signalservice.DataMessage.Sticker.verify|verify} messages.
             * @param message Sticker message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.DataMessage.ISticker, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Sticker message, length delimited. Does not implicitly {@link signalservice.DataMessage.Sticker.verify|verify} messages.
             * @param message Sticker message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.DataMessage.ISticker, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Sticker message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Sticker
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Sticker;

            /**
             * Decodes a Sticker message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Sticker
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Sticker;

            /**
             * Verifies a Sticker message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Sticker message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Sticker
             */
            public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Sticker;

            /**
             * Creates a plain object from a Sticker message. Also converts values to other types if specified.
             * @param message Sticker
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.DataMessage.Sticker, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Sticker to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Sticker
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Reaction. */
        interface IReaction {

            /** Reaction emoji */
            emoji?: (string|null);

            /** Reaction remove */
            remove?: (boolean|null);

            /** Reaction targetAuthorAci */
            targetAuthorAci?: (string|null);

            /** Reaction targetTimestamp */
            targetTimestamp?: (number|Long|null);
        }

        /** Represents a Reaction. */
        class Reaction implements IReaction {

            /**
             * Constructs a new Reaction.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.DataMessage.IReaction);

            /** Reaction emoji. */
            public emoji: string;

            /** Reaction remove. */
            public remove: boolean;

            /** Reaction targetAuthorAci. */
            public targetAuthorAci: string;

            /** Reaction targetTimestamp. */
            public targetTimestamp: (number|Long);

            /**
             * Creates a new Reaction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Reaction instance
             */
            public static create(properties?: signalservice.DataMessage.IReaction): signalservice.DataMessage.Reaction;

            /**
             * Encodes the specified Reaction message. Does not implicitly {@link signalservice.DataMessage.Reaction.verify|verify} messages.
             * @param message Reaction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.DataMessage.IReaction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Reaction message, length delimited. Does not implicitly {@link signalservice.DataMessage.Reaction.verify|verify} messages.
             * @param message Reaction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.DataMessage.IReaction, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Reaction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Reaction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Reaction;

            /**
             * Decodes a Reaction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Reaction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Reaction;

            /**
             * Verifies a Reaction message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Reaction message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Reaction
             */
            public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Reaction;

            /**
             * Creates a plain object from a Reaction message. Also converts values to other types if specified.
             * @param message Reaction
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.DataMessage.Reaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Reaction to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Reaction
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Delete. */
        interface IDelete {

            /** Delete targetSentTimestamp */
            targetSentTimestamp?: (number|Long|null);
        }

        /** Represents a Delete. */
        class Delete implements IDelete {

            /**
             * Constructs a new Delete.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.DataMessage.IDelete);

            /** Delete targetSentTimestamp. */
            public targetSentTimestamp: (number|Long);

            /**
             * Creates a new Delete instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Delete instance
             */
            public static create(properties?: signalservice.DataMessage.IDelete): signalservice.DataMessage.Delete;

            /**
             * Encodes the specified Delete message. Does not implicitly {@link signalservice.DataMessage.Delete.verify|verify} messages.
             * @param message Delete message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.DataMessage.IDelete, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Delete message, length delimited. Does not implicitly {@link signalservice.DataMessage.Delete.verify|verify} messages.
             * @param message Delete message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.DataMessage.IDelete, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Delete message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Delete
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.Delete;

            /**
             * Decodes a Delete message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Delete
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.Delete;

            /**
             * Verifies a Delete message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Delete message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Delete
             */
            public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.Delete;

            /**
             * Creates a plain object from a Delete message. Also converts values to other types if specified.
             * @param message Delete
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.DataMessage.Delete, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Delete to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Delete
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a BodyRange. */
        interface IBodyRange {

            /** BodyRange start */
            start?: (number|null);

            /** BodyRange length */
            length?: (number|null);

            /** BodyRange mentionAci */
            mentionAci?: (string|null);

            /** BodyRange style */
            style?: (signalservice.DataMessage.BodyRange.Style|null);
        }

        /** Represents a BodyRange. */
        class BodyRange implements IBodyRange {

            /**
             * Constructs a new BodyRange.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.DataMessage.IBodyRange);

            /** BodyRange start. */
            public start: number;

            /** BodyRange length. */
            public length: number;

            /** BodyRange mentionAci. */
            public mentionAci?: (string|null);

            /** BodyRange style. */
            public style?: (signalservice.DataMessage.BodyRange.Style|null);

            /** BodyRange associatedValue. */
            public associatedValue?: ("mentionAci"|"style");

            /**
             * Creates a new BodyRange instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BodyRange instance
             */
            public static create(properties?: signalservice.DataMessage.IBodyRange): signalservice.DataMessage.BodyRange;

            /**
             * Encodes the specified BodyRange message. Does not implicitly {@link signalservice.DataMessage.BodyRange.verify|verify} messages.
             * @param message BodyRange message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.DataMessage.IBodyRange, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BodyRange message, length delimited. Does not implicitly {@link signalservice.DataMessage.BodyRange.verify|verify} messages.
             * @param message BodyRange message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.DataMessage.IBodyRange, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BodyRange message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BodyRange
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.BodyRange;

            /**
             * Decodes a BodyRange message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BodyRange
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.BodyRange;

            /**
             * Verifies a BodyRange message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BodyRange message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BodyRange
             */
            public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.BodyRange;

            /**
             * Creates a plain object from a BodyRange message. Also converts values to other types if specified.
             * @param message BodyRange
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.DataMessage.BodyRange, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BodyRange to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for BodyRange
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace BodyRange {

            /** Style enum. */
            enum Style {
                NONE = 0,
                BOLD = 1,
                ITALIC = 2,
                SPOILER = 3,
                STRIKETHROUGH = 4,
                MONOSPACE = 5
            }
        }

        /** Properties of a GroupCallUpdate. */
        interface IGroupCallUpdate {

            /** GroupCallUpdate eraId */
            eraId?: (string|null);
        }

        /** Represents a GroupCallUpdate. */
        class GroupCallUpdate implements IGroupCallUpdate {

            /**
             * Constructs a new GroupCallUpdate.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.DataMessage.IGroupCallUpdate);

            /** GroupCallUpdate eraId. */
            public eraId: string;

            /**
             * Creates a new GroupCallUpdate instance using the specified properties.
             * @param [properties] Properties to set
             * @returns GroupCallUpdate instance
             */
            public static create(properties?: signalservice.DataMessage.IGroupCallUpdate): signalservice.DataMessage.GroupCallUpdate;

            /**
             * Encodes the specified GroupCallUpdate message. Does not implicitly {@link signalservice.DataMessage.GroupCallUpdate.verify|verify} messages.
             * @param message GroupCallUpdate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.DataMessage.IGroupCallUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GroupCallUpdate message, length delimited. Does not implicitly {@link signalservice.DataMessage.GroupCallUpdate.verify|verify} messages.
             * @param message GroupCallUpdate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.DataMessage.IGroupCallUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GroupCallUpdate message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GroupCallUpdate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.GroupCallUpdate;

            /**
             * Decodes a GroupCallUpdate message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GroupCallUpdate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.GroupCallUpdate;

            /**
             * Verifies a GroupCallUpdate message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GroupCallUpdate message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GroupCallUpdate
             */
            public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.GroupCallUpdate;

            /**
             * Creates a plain object from a GroupCallUpdate message. Also converts values to other types if specified.
             * @param message GroupCallUpdate
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.DataMessage.GroupCallUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this GroupCallUpdate to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for GroupCallUpdate
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a StoryContext. */
        interface IStoryContext {

            /** StoryContext authorAci */
            authorAci?: (string|null);

            /** StoryContext sentTimestamp */
            sentTimestamp?: (number|Long|null);
        }

        /** Represents a StoryContext. */
        class StoryContext implements IStoryContext {

            /**
             * Constructs a new StoryContext.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.DataMessage.IStoryContext);

            /** StoryContext authorAci. */
            public authorAci: string;

            /** StoryContext sentTimestamp. */
            public sentTimestamp: (number|Long);

            /**
             * Creates a new StoryContext instance using the specified properties.
             * @param [properties] Properties to set
             * @returns StoryContext instance
             */
            public static create(properties?: signalservice.DataMessage.IStoryContext): signalservice.DataMessage.StoryContext;

            /**
             * Encodes the specified StoryContext message. Does not implicitly {@link signalservice.DataMessage.StoryContext.verify|verify} messages.
             * @param message StoryContext message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.DataMessage.IStoryContext, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified StoryContext message, length delimited. Does not implicitly {@link signalservice.DataMessage.StoryContext.verify|verify} messages.
             * @param message StoryContext message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.DataMessage.IStoryContext, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a StoryContext message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns StoryContext
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.StoryContext;

            /**
             * Decodes a StoryContext message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns StoryContext
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.StoryContext;

            /**
             * Verifies a StoryContext message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a StoryContext message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns StoryContext
             */
            public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.StoryContext;

            /**
             * Creates a plain object from a StoryContext message. Also converts values to other types if specified.
             * @param message StoryContext
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.DataMessage.StoryContext, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this StoryContext to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for StoryContext
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** ProtocolVersion enum. */
        enum ProtocolVersion {
            INITIAL = 0,
            MESSAGE_TIMERS = 1,
            VIEW_ONCE = 2,
            VIEW_ONCE_VIDEO = 3,
            REACTIONS = 4,
            CDN_SELECTOR_ATTACHMENTS = 5,
            MENTIONS = 6,
            PAYMENTS = 7,
            CURRENT = 7
        }

        /** Properties of a GiftBadge. */
        interface IGiftBadge {

            /** GiftBadge receiptCredentialPresentation */
            receiptCredentialPresentation?: (Uint8Array|null);
        }

        /** Represents a GiftBadge. */
        class GiftBadge implements IGiftBadge {

            /**
             * Constructs a new GiftBadge.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.DataMessage.IGiftBadge);

            /** GiftBadge receiptCredentialPresentation. */
            public receiptCredentialPresentation: Uint8Array;

            /**
             * Creates a new GiftBadge instance using the specified properties.
             * @param [properties] Properties to set
             * @returns GiftBadge instance
             */
            public static create(properties?: signalservice.DataMessage.IGiftBadge): signalservice.DataMessage.GiftBadge;

            /**
             * Encodes the specified GiftBadge message. Does not implicitly {@link signalservice.DataMessage.GiftBadge.verify|verify} messages.
             * @param message GiftBadge message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.DataMessage.IGiftBadge, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GiftBadge message, length delimited. Does not implicitly {@link signalservice.DataMessage.GiftBadge.verify|verify} messages.
             * @param message GiftBadge message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.DataMessage.IGiftBadge, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GiftBadge message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GiftBadge
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.DataMessage.GiftBadge;

            /**
             * Decodes a GiftBadge message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GiftBadge
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.DataMessage.GiftBadge;

            /**
             * Verifies a GiftBadge message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GiftBadge message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GiftBadge
             */
            public static fromObject(object: { [k: string]: any }): signalservice.DataMessage.GiftBadge;

            /**
             * Creates a plain object from a GiftBadge message. Also converts values to other types if specified.
             * @param message GiftBadge
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.DataMessage.GiftBadge, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this GiftBadge to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for GiftBadge
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    /** Properties of a NullMessage. */
    interface INullMessage {

        /** NullMessage padding */
        padding?: (Uint8Array|null);
    }

    /** Represents a NullMessage. */
    class NullMessage implements INullMessage {

        /**
         * Constructs a new NullMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.INullMessage);

        /** NullMessage padding. */
        public padding: Uint8Array;

        /**
         * Creates a new NullMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NullMessage instance
         */
        public static create(properties?: signalservice.INullMessage): signalservice.NullMessage;

        /**
         * Encodes the specified NullMessage message. Does not implicitly {@link signalservice.NullMessage.verify|verify} messages.
         * @param message NullMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.INullMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NullMessage message, length delimited. Does not implicitly {@link signalservice.NullMessage.verify|verify} messages.
         * @param message NullMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.INullMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NullMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NullMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.NullMessage;

        /**
         * Decodes a NullMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NullMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.NullMessage;

        /**
         * Verifies a NullMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NullMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NullMessage
         */
        public static fromObject(object: { [k: string]: any }): signalservice.NullMessage;

        /**
         * Creates a plain object from a NullMessage message. Also converts values to other types if specified.
         * @param message NullMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.NullMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NullMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for NullMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ReceiptMessage. */
    interface IReceiptMessage {

        /** ReceiptMessage type */
        type?: (signalservice.ReceiptMessage.Type|null);

        /** ReceiptMessage timestamp */
        timestamp?: ((number|Long)[]|null);
    }

    /** Represents a ReceiptMessage. */
    class ReceiptMessage implements IReceiptMessage {

        /**
         * Constructs a new ReceiptMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IReceiptMessage);

        /** ReceiptMessage type. */
        public type: signalservice.ReceiptMessage.Type;

        /** ReceiptMessage timestamp. */
        public timestamp: (number|Long)[];

        /**
         * Creates a new ReceiptMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ReceiptMessage instance
         */
        public static create(properties?: signalservice.IReceiptMessage): signalservice.ReceiptMessage;

        /**
         * Encodes the specified ReceiptMessage message. Does not implicitly {@link signalservice.ReceiptMessage.verify|verify} messages.
         * @param message ReceiptMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IReceiptMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ReceiptMessage message, length delimited. Does not implicitly {@link signalservice.ReceiptMessage.verify|verify} messages.
         * @param message ReceiptMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IReceiptMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ReceiptMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ReceiptMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.ReceiptMessage;

        /**
         * Decodes a ReceiptMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ReceiptMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.ReceiptMessage;

        /**
         * Verifies a ReceiptMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ReceiptMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ReceiptMessage
         */
        public static fromObject(object: { [k: string]: any }): signalservice.ReceiptMessage;

        /**
         * Creates a plain object from a ReceiptMessage message. Also converts values to other types if specified.
         * @param message ReceiptMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.ReceiptMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ReceiptMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ReceiptMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace ReceiptMessage {

        /** Type enum. */
        enum Type {
            DELIVERY = 0,
            READ = 1,
            VIEWED = 2
        }
    }

    /** Properties of a TypingMessage. */
    interface ITypingMessage {

        /** TypingMessage timestamp */
        timestamp?: (number|Long|null);

        /** TypingMessage action */
        action?: (signalservice.TypingMessage.Action|null);

        /** TypingMessage groupId */
        groupId?: (Uint8Array|null);
    }

    /** Represents a TypingMessage. */
    class TypingMessage implements ITypingMessage {

        /**
         * Constructs a new TypingMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.ITypingMessage);

        /** TypingMessage timestamp. */
        public timestamp: (number|Long);

        /** TypingMessage action. */
        public action: signalservice.TypingMessage.Action;

        /** TypingMessage groupId. */
        public groupId: Uint8Array;

        /**
         * Creates a new TypingMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TypingMessage instance
         */
        public static create(properties?: signalservice.ITypingMessage): signalservice.TypingMessage;

        /**
         * Encodes the specified TypingMessage message. Does not implicitly {@link signalservice.TypingMessage.verify|verify} messages.
         * @param message TypingMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.ITypingMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TypingMessage message, length delimited. Does not implicitly {@link signalservice.TypingMessage.verify|verify} messages.
         * @param message TypingMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.ITypingMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TypingMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TypingMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.TypingMessage;

        /**
         * Decodes a TypingMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TypingMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.TypingMessage;

        /**
         * Verifies a TypingMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TypingMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TypingMessage
         */
        public static fromObject(object: { [k: string]: any }): signalservice.TypingMessage;

        /**
         * Creates a plain object from a TypingMessage message. Also converts values to other types if specified.
         * @param message TypingMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.TypingMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TypingMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TypingMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace TypingMessage {

        /** Action enum. */
        enum Action {
            STARTED = 0,
            STOPPED = 1
        }
    }

    /** Properties of a StoryMessage. */
    interface IStoryMessage {

        /** StoryMessage profileKey */
        profileKey?: (Uint8Array|null);

        /** StoryMessage group */
        group?: (signalservice.IGroupContextV2|null);

        /** StoryMessage fileAttachment */
        fileAttachment?: (signalservice.IAttachmentPointer|null);

        /** StoryMessage textAttachment */
        textAttachment?: (signalservice.ITextAttachment|null);

        /** StoryMessage allowsReplies */
        allowsReplies?: (boolean|null);

        /** StoryMessage bodyRanges */
        bodyRanges?: (signalservice.DataMessage.IBodyRange[]|null);
    }

    /** Represents a StoryMessage. */
    class StoryMessage implements IStoryMessage {

        /**
         * Constructs a new StoryMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IStoryMessage);

        /** StoryMessage profileKey. */
        public profileKey: Uint8Array;

        /** StoryMessage group. */
        public group?: (signalservice.IGroupContextV2|null);

        /** StoryMessage fileAttachment. */
        public fileAttachment?: (signalservice.IAttachmentPointer|null);

        /** StoryMessage textAttachment. */
        public textAttachment?: (signalservice.ITextAttachment|null);

        /** StoryMessage allowsReplies. */
        public allowsReplies: boolean;

        /** StoryMessage bodyRanges. */
        public bodyRanges: signalservice.DataMessage.IBodyRange[];

        /** StoryMessage attachment. */
        public attachment?: ("fileAttachment"|"textAttachment");

        /**
         * Creates a new StoryMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StoryMessage instance
         */
        public static create(properties?: signalservice.IStoryMessage): signalservice.StoryMessage;

        /**
         * Encodes the specified StoryMessage message. Does not implicitly {@link signalservice.StoryMessage.verify|verify} messages.
         * @param message StoryMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IStoryMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StoryMessage message, length delimited. Does not implicitly {@link signalservice.StoryMessage.verify|verify} messages.
         * @param message StoryMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IStoryMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StoryMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StoryMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.StoryMessage;

        /**
         * Decodes a StoryMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StoryMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.StoryMessage;

        /**
         * Verifies a StoryMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StoryMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StoryMessage
         */
        public static fromObject(object: { [k: string]: any }): signalservice.StoryMessage;

        /**
         * Creates a plain object from a StoryMessage message. Also converts values to other types if specified.
         * @param message StoryMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.StoryMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StoryMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for StoryMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TextAttachment. */
    interface ITextAttachment {

        /** TextAttachment text */
        text?: (string|null);

        /** TextAttachment textStyle */
        textStyle?: (signalservice.TextAttachment.Style|null);

        /** TextAttachment textForegroundColor */
        textForegroundColor?: (number|null);

        /** TextAttachment textBackgroundColor */
        textBackgroundColor?: (number|null);

        /** TextAttachment preview */
        preview?: (signalservice.DataMessage.IPreview|null);

        /** TextAttachment gradient */
        gradient?: (signalservice.TextAttachment.IGradient|null);

        /** TextAttachment color */
        color?: (number|null);
    }

    /** Represents a TextAttachment. */
    class TextAttachment implements ITextAttachment {

        /**
         * Constructs a new TextAttachment.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.ITextAttachment);

        /** TextAttachment text. */
        public text: string;

        /** TextAttachment textStyle. */
        public textStyle: signalservice.TextAttachment.Style;

        /** TextAttachment textForegroundColor. */
        public textForegroundColor: number;

        /** TextAttachment textBackgroundColor. */
        public textBackgroundColor: number;

        /** TextAttachment preview. */
        public preview?: (signalservice.DataMessage.IPreview|null);

        /** TextAttachment gradient. */
        public gradient?: (signalservice.TextAttachment.IGradient|null);

        /** TextAttachment color. */
        public color?: (number|null);

        /** TextAttachment background. */
        public background?: ("gradient"|"color");

        /**
         * Creates a new TextAttachment instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TextAttachment instance
         */
        public static create(properties?: signalservice.ITextAttachment): signalservice.TextAttachment;

        /**
         * Encodes the specified TextAttachment message. Does not implicitly {@link signalservice.TextAttachment.verify|verify} messages.
         * @param message TextAttachment message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.ITextAttachment, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TextAttachment message, length delimited. Does not implicitly {@link signalservice.TextAttachment.verify|verify} messages.
         * @param message TextAttachment message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.ITextAttachment, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TextAttachment message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TextAttachment
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.TextAttachment;

        /**
         * Decodes a TextAttachment message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TextAttachment
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.TextAttachment;

        /**
         * Verifies a TextAttachment message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TextAttachment message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TextAttachment
         */
        public static fromObject(object: { [k: string]: any }): signalservice.TextAttachment;

        /**
         * Creates a plain object from a TextAttachment message. Also converts values to other types if specified.
         * @param message TextAttachment
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.TextAttachment, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TextAttachment to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TextAttachment
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace TextAttachment {

        /** Style enum. */
        enum Style {
            DEFAULT = 0,
            REGULAR = 1,
            BOLD = 2,
            SERIF = 3,
            SCRIPT = 4,
            CONDENSED = 5
        }

        /** Properties of a Gradient. */
        interface IGradient {

            /** Gradient startColor */
            startColor?: (number|null);

            /** Gradient endColor */
            endColor?: (number|null);

            /** Gradient angle */
            angle?: (number|null);

            /** Gradient colors */
            colors?: (number[]|null);

            /** Gradient positions */
            positions?: (number[]|null);
        }

        /** Represents a Gradient. */
        class Gradient implements IGradient {

            /**
             * Constructs a new Gradient.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.TextAttachment.IGradient);

            /** Gradient startColor. */
            public startColor: number;

            /** Gradient endColor. */
            public endColor: number;

            /** Gradient angle. */
            public angle: number;

            /** Gradient colors. */
            public colors: number[];

            /** Gradient positions. */
            public positions: number[];

            /**
             * Creates a new Gradient instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Gradient instance
             */
            public static create(properties?: signalservice.TextAttachment.IGradient): signalservice.TextAttachment.Gradient;

            /**
             * Encodes the specified Gradient message. Does not implicitly {@link signalservice.TextAttachment.Gradient.verify|verify} messages.
             * @param message Gradient message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.TextAttachment.IGradient, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Gradient message, length delimited. Does not implicitly {@link signalservice.TextAttachment.Gradient.verify|verify} messages.
             * @param message Gradient message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.TextAttachment.IGradient, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Gradient message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Gradient
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.TextAttachment.Gradient;

            /**
             * Decodes a Gradient message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Gradient
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.TextAttachment.Gradient;

            /**
             * Verifies a Gradient message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Gradient message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Gradient
             */
            public static fromObject(object: { [k: string]: any }): signalservice.TextAttachment.Gradient;

            /**
             * Creates a plain object from a Gradient message. Also converts values to other types if specified.
             * @param message Gradient
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.TextAttachment.Gradient, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Gradient to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Gradient
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    /** Properties of a Verified. */
    interface IVerified {

        /** Verified destination */
        destination?: (string|null);

        /** Verified destinationAci */
        destinationAci?: (string|null);

        /** Verified identityKey */
        identityKey?: (Uint8Array|null);

        /** Verified state */
        state?: (signalservice.Verified.State|null);

        /** Verified nullMessage */
        nullMessage?: (Uint8Array|null);
    }

    /** Represents a Verified. */
    class Verified implements IVerified {

        /**
         * Constructs a new Verified.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IVerified);

        /** Verified destination. */
        public destination: string;

        /** Verified destinationAci. */
        public destinationAci: string;

        /** Verified identityKey. */
        public identityKey: Uint8Array;

        /** Verified state. */
        public state: signalservice.Verified.State;

        /** Verified nullMessage. */
        public nullMessage: Uint8Array;

        /**
         * Creates a new Verified instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Verified instance
         */
        public static create(properties?: signalservice.IVerified): signalservice.Verified;

        /**
         * Encodes the specified Verified message. Does not implicitly {@link signalservice.Verified.verify|verify} messages.
         * @param message Verified message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IVerified, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Verified message, length delimited. Does not implicitly {@link signalservice.Verified.verify|verify} messages.
         * @param message Verified message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IVerified, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Verified message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Verified
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.Verified;

        /**
         * Decodes a Verified message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Verified
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.Verified;

        /**
         * Verifies a Verified message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Verified message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Verified
         */
        public static fromObject(object: { [k: string]: any }): signalservice.Verified;

        /**
         * Creates a plain object from a Verified message. Also converts values to other types if specified.
         * @param message Verified
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.Verified, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Verified to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Verified
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace Verified {

        /** State enum. */
        enum State {
            DEFAULT = 0,
            VERIFIED = 1,
            UNVERIFIED = 2
        }
    }

    /** Properties of a SyncMessage. */
    interface ISyncMessage {

        /** SyncMessage sent */
        sent?: (signalservice.SyncMessage.ISent|null);

        /** SyncMessage contacts */
        contacts?: (signalservice.SyncMessage.IContacts|null);

        /** SyncMessage request */
        request?: (signalservice.SyncMessage.IRequest|null);

        /** SyncMessage read */
        read?: (signalservice.SyncMessage.IRead[]|null);

        /** SyncMessage blocked */
        blocked?: (signalservice.SyncMessage.IBlocked|null);

        /** SyncMessage verified */
        verified?: (signalservice.IVerified|null);

        /** SyncMessage configuration */
        configuration?: (signalservice.SyncMessage.IConfiguration|null);

        /** SyncMessage padding */
        padding?: (Uint8Array|null);

        /** SyncMessage stickerPackOperation */
        stickerPackOperation?: (signalservice.SyncMessage.IStickerPackOperation[]|null);

        /** SyncMessage viewOnceOpen */
        viewOnceOpen?: (signalservice.SyncMessage.IViewOnceOpen|null);

        /** SyncMessage fetchLatest */
        fetchLatest?: (signalservice.SyncMessage.IFetchLatest|null);

        /** SyncMessage keys */
        keys?: (signalservice.SyncMessage.IKeys|null);

        /** SyncMessage messageRequestResponse */
        messageRequestResponse?: (signalservice.SyncMessage.IMessageRequestResponse|null);

        /** SyncMessage viewed */
        viewed?: (signalservice.SyncMessage.IViewed[]|null);

        /** SyncMessage pniChangeNumber */
        pniChangeNumber?: (signalservice.SyncMessage.IPniChangeNumber|null);

        /** SyncMessage callEvent */
        callEvent?: (signalservice.SyncMessage.ICallEvent|null);

        /** SyncMessage callLinkUpdate */
        callLinkUpdate?: (signalservice.SyncMessage.ICallLinkUpdate|null);

        /** SyncMessage callLogEvent */
        callLogEvent?: (signalservice.SyncMessage.ICallLogEvent|null);

        /** SyncMessage deleteForMe */
        deleteForMe?: (signalservice.SyncMessage.IDeleteForMe|null);
    }

    /** Represents a SyncMessage. */
    class SyncMessage implements ISyncMessage {

        /**
         * Constructs a new SyncMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.ISyncMessage);

        /** SyncMessage sent. */
        public sent?: (signalservice.SyncMessage.ISent|null);

        /** SyncMessage contacts. */
        public contacts?: (signalservice.SyncMessage.IContacts|null);

        /** SyncMessage request. */
        public request?: (signalservice.SyncMessage.IRequest|null);

        /** SyncMessage read. */
        public read: signalservice.SyncMessage.IRead[];

        /** SyncMessage blocked. */
        public blocked?: (signalservice.SyncMessage.IBlocked|null);

        /** SyncMessage verified. */
        public verified?: (signalservice.IVerified|null);

        /** SyncMessage configuration. */
        public configuration?: (signalservice.SyncMessage.IConfiguration|null);

        /** SyncMessage padding. */
        public padding: Uint8Array;

        /** SyncMessage stickerPackOperation. */
        public stickerPackOperation: signalservice.SyncMessage.IStickerPackOperation[];

        /** SyncMessage viewOnceOpen. */
        public viewOnceOpen?: (signalservice.SyncMessage.IViewOnceOpen|null);

        /** SyncMessage fetchLatest. */
        public fetchLatest?: (signalservice.SyncMessage.IFetchLatest|null);

        /** SyncMessage keys. */
        public keys?: (signalservice.SyncMessage.IKeys|null);

        /** SyncMessage messageRequestResponse. */
        public messageRequestResponse?: (signalservice.SyncMessage.IMessageRequestResponse|null);

        /** SyncMessage viewed. */
        public viewed: signalservice.SyncMessage.IViewed[];

        /** SyncMessage pniChangeNumber. */
        public pniChangeNumber?: (signalservice.SyncMessage.IPniChangeNumber|null);

        /** SyncMessage callEvent. */
        public callEvent?: (signalservice.SyncMessage.ICallEvent|null);

        /** SyncMessage callLinkUpdate. */
        public callLinkUpdate?: (signalservice.SyncMessage.ICallLinkUpdate|null);

        /** SyncMessage callLogEvent. */
        public callLogEvent?: (signalservice.SyncMessage.ICallLogEvent|null);

        /** SyncMessage deleteForMe. */
        public deleteForMe?: (signalservice.SyncMessage.IDeleteForMe|null);

        /**
         * Creates a new SyncMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SyncMessage instance
         */
        public static create(properties?: signalservice.ISyncMessage): signalservice.SyncMessage;

        /**
         * Encodes the specified SyncMessage message. Does not implicitly {@link signalservice.SyncMessage.verify|verify} messages.
         * @param message SyncMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.ISyncMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SyncMessage message, length delimited. Does not implicitly {@link signalservice.SyncMessage.verify|verify} messages.
         * @param message SyncMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.ISyncMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SyncMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SyncMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage;

        /**
         * Decodes a SyncMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SyncMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage;

        /**
         * Verifies a SyncMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SyncMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SyncMessage
         */
        public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage;

        /**
         * Creates a plain object from a SyncMessage message. Also converts values to other types if specified.
         * @param message SyncMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.SyncMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SyncMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SyncMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace SyncMessage {

        /** Properties of a Sent. */
        interface ISent {

            /** Sent destination */
            destination?: (string|null);

            /** Sent destinationServiceId */
            destinationServiceId?: (string|null);

            /** Sent timestamp */
            timestamp?: (number|Long|null);

            /** Sent message */
            message?: (signalservice.IDataMessage|null);

            /** Sent expirationStartTimestamp */
            expirationStartTimestamp?: (number|Long|null);

            /** Sent unidentifiedStatus */
            unidentifiedStatus?: (signalservice.SyncMessage.Sent.IUnidentifiedDeliveryStatus[]|null);

            /** Sent isRecipientUpdate */
            isRecipientUpdate?: (boolean|null);

            /** Sent storyMessage */
            storyMessage?: (signalservice.IStoryMessage|null);

            /** Sent storyMessageRecipients */
            storyMessageRecipients?: (signalservice.SyncMessage.Sent.IStoryMessageRecipient[]|null);

            /** Sent editMessage */
            editMessage?: (signalservice.IEditMessage|null);
        }

        /** Represents a Sent. */
        class Sent implements ISent {

            /**
             * Constructs a new Sent.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.ISent);

            /** Sent destination. */
            public destination: string;

            /** Sent destinationServiceId. */
            public destinationServiceId: string;

            /** Sent timestamp. */
            public timestamp: (number|Long);

            /** Sent message. */
            public message?: (signalservice.IDataMessage|null);

            /** Sent expirationStartTimestamp. */
            public expirationStartTimestamp: (number|Long);

            /** Sent unidentifiedStatus. */
            public unidentifiedStatus: signalservice.SyncMessage.Sent.IUnidentifiedDeliveryStatus[];

            /** Sent isRecipientUpdate. */
            public isRecipientUpdate: boolean;

            /** Sent storyMessage. */
            public storyMessage?: (signalservice.IStoryMessage|null);

            /** Sent storyMessageRecipients. */
            public storyMessageRecipients: signalservice.SyncMessage.Sent.IStoryMessageRecipient[];

            /** Sent editMessage. */
            public editMessage?: (signalservice.IEditMessage|null);

            /**
             * Creates a new Sent instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Sent instance
             */
            public static create(properties?: signalservice.SyncMessage.ISent): signalservice.SyncMessage.Sent;

            /**
             * Encodes the specified Sent message. Does not implicitly {@link signalservice.SyncMessage.Sent.verify|verify} messages.
             * @param message Sent message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.ISent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Sent message, length delimited. Does not implicitly {@link signalservice.SyncMessage.Sent.verify|verify} messages.
             * @param message Sent message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.ISent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Sent message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Sent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.Sent;

            /**
             * Decodes a Sent message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Sent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.Sent;

            /**
             * Verifies a Sent message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Sent message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Sent
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.Sent;

            /**
             * Creates a plain object from a Sent message. Also converts values to other types if specified.
             * @param message Sent
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.Sent, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Sent to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Sent
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace Sent {

            /** Properties of an UnidentifiedDeliveryStatus. */
            interface IUnidentifiedDeliveryStatus {

                /** UnidentifiedDeliveryStatus destination */
                destination?: (string|null);

                /** UnidentifiedDeliveryStatus destinationServiceId */
                destinationServiceId?: (string|null);

                /** UnidentifiedDeliveryStatus unidentified */
                unidentified?: (boolean|null);

                /** UnidentifiedDeliveryStatus destinationPniIdentityKey */
                destinationPniIdentityKey?: (Uint8Array|null);
            }

            /** Represents an UnidentifiedDeliveryStatus. */
            class UnidentifiedDeliveryStatus implements IUnidentifiedDeliveryStatus {

                /**
                 * Constructs a new UnidentifiedDeliveryStatus.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.SyncMessage.Sent.IUnidentifiedDeliveryStatus);

                /** UnidentifiedDeliveryStatus destination. */
                public destination: string;

                /** UnidentifiedDeliveryStatus destinationServiceId. */
                public destinationServiceId: string;

                /** UnidentifiedDeliveryStatus unidentified. */
                public unidentified: boolean;

                /** UnidentifiedDeliveryStatus destinationPniIdentityKey. */
                public destinationPniIdentityKey: Uint8Array;

                /**
                 * Creates a new UnidentifiedDeliveryStatus instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns UnidentifiedDeliveryStatus instance
                 */
                public static create(properties?: signalservice.SyncMessage.Sent.IUnidentifiedDeliveryStatus): signalservice.SyncMessage.Sent.UnidentifiedDeliveryStatus;

                /**
                 * Encodes the specified UnidentifiedDeliveryStatus message. Does not implicitly {@link signalservice.SyncMessage.Sent.UnidentifiedDeliveryStatus.verify|verify} messages.
                 * @param message UnidentifiedDeliveryStatus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.SyncMessage.Sent.IUnidentifiedDeliveryStatus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified UnidentifiedDeliveryStatus message, length delimited. Does not implicitly {@link signalservice.SyncMessage.Sent.UnidentifiedDeliveryStatus.verify|verify} messages.
                 * @param message UnidentifiedDeliveryStatus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.SyncMessage.Sent.IUnidentifiedDeliveryStatus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an UnidentifiedDeliveryStatus message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns UnidentifiedDeliveryStatus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.Sent.UnidentifiedDeliveryStatus;

                /**
                 * Decodes an UnidentifiedDeliveryStatus message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns UnidentifiedDeliveryStatus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.Sent.UnidentifiedDeliveryStatus;

                /**
                 * Verifies an UnidentifiedDeliveryStatus message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an UnidentifiedDeliveryStatus message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns UnidentifiedDeliveryStatus
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.Sent.UnidentifiedDeliveryStatus;

                /**
                 * Creates a plain object from an UnidentifiedDeliveryStatus message. Also converts values to other types if specified.
                 * @param message UnidentifiedDeliveryStatus
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.SyncMessage.Sent.UnidentifiedDeliveryStatus, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this UnidentifiedDeliveryStatus to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for UnidentifiedDeliveryStatus
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a StoryMessageRecipient. */
            interface IStoryMessageRecipient {

                /** StoryMessageRecipient destinationServiceId */
                destinationServiceId?: (string|null);

                /** StoryMessageRecipient distributionListIds */
                distributionListIds?: (string[]|null);

                /** StoryMessageRecipient isAllowedToReply */
                isAllowedToReply?: (boolean|null);
            }

            /** Represents a StoryMessageRecipient. */
            class StoryMessageRecipient implements IStoryMessageRecipient {

                /**
                 * Constructs a new StoryMessageRecipient.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.SyncMessage.Sent.IStoryMessageRecipient);

                /** StoryMessageRecipient destinationServiceId. */
                public destinationServiceId: string;

                /** StoryMessageRecipient distributionListIds. */
                public distributionListIds: string[];

                /** StoryMessageRecipient isAllowedToReply. */
                public isAllowedToReply: boolean;

                /**
                 * Creates a new StoryMessageRecipient instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns StoryMessageRecipient instance
                 */
                public static create(properties?: signalservice.SyncMessage.Sent.IStoryMessageRecipient): signalservice.SyncMessage.Sent.StoryMessageRecipient;

                /**
                 * Encodes the specified StoryMessageRecipient message. Does not implicitly {@link signalservice.SyncMessage.Sent.StoryMessageRecipient.verify|verify} messages.
                 * @param message StoryMessageRecipient message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.SyncMessage.Sent.IStoryMessageRecipient, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified StoryMessageRecipient message, length delimited. Does not implicitly {@link signalservice.SyncMessage.Sent.StoryMessageRecipient.verify|verify} messages.
                 * @param message StoryMessageRecipient message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.SyncMessage.Sent.IStoryMessageRecipient, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a StoryMessageRecipient message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns StoryMessageRecipient
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.Sent.StoryMessageRecipient;

                /**
                 * Decodes a StoryMessageRecipient message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns StoryMessageRecipient
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.Sent.StoryMessageRecipient;

                /**
                 * Verifies a StoryMessageRecipient message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a StoryMessageRecipient message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns StoryMessageRecipient
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.Sent.StoryMessageRecipient;

                /**
                 * Creates a plain object from a StoryMessageRecipient message. Also converts values to other types if specified.
                 * @param message StoryMessageRecipient
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.SyncMessage.Sent.StoryMessageRecipient, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this StoryMessageRecipient to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for StoryMessageRecipient
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a Contacts. */
        interface IContacts {

            /** Contacts blob */
            blob?: (signalservice.IAttachmentPointer|null);

            /** Contacts complete */
            complete?: (boolean|null);
        }

        /** Represents a Contacts. */
        class Contacts implements IContacts {

            /**
             * Constructs a new Contacts.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.IContacts);

            /** Contacts blob. */
            public blob?: (signalservice.IAttachmentPointer|null);

            /** Contacts complete. */
            public complete: boolean;

            /**
             * Creates a new Contacts instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Contacts instance
             */
            public static create(properties?: signalservice.SyncMessage.IContacts): signalservice.SyncMessage.Contacts;

            /**
             * Encodes the specified Contacts message. Does not implicitly {@link signalservice.SyncMessage.Contacts.verify|verify} messages.
             * @param message Contacts message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.IContacts, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Contacts message, length delimited. Does not implicitly {@link signalservice.SyncMessage.Contacts.verify|verify} messages.
             * @param message Contacts message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.IContacts, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Contacts message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Contacts
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.Contacts;

            /**
             * Decodes a Contacts message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Contacts
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.Contacts;

            /**
             * Verifies a Contacts message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Contacts message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Contacts
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.Contacts;

            /**
             * Creates a plain object from a Contacts message. Also converts values to other types if specified.
             * @param message Contacts
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.Contacts, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Contacts to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Contacts
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Blocked. */
        interface IBlocked {

            /** Blocked numbers */
            numbers?: (string[]|null);

            /** Blocked acis */
            acis?: (string[]|null);

            /** Blocked groupIds */
            groupIds?: (Uint8Array[]|null);
        }

        /** Represents a Blocked. */
        class Blocked implements IBlocked {

            /**
             * Constructs a new Blocked.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.IBlocked);

            /** Blocked numbers. */
            public numbers: string[];

            /** Blocked acis. */
            public acis: string[];

            /** Blocked groupIds. */
            public groupIds: Uint8Array[];

            /**
             * Creates a new Blocked instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Blocked instance
             */
            public static create(properties?: signalservice.SyncMessage.IBlocked): signalservice.SyncMessage.Blocked;

            /**
             * Encodes the specified Blocked message. Does not implicitly {@link signalservice.SyncMessage.Blocked.verify|verify} messages.
             * @param message Blocked message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.IBlocked, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Blocked message, length delimited. Does not implicitly {@link signalservice.SyncMessage.Blocked.verify|verify} messages.
             * @param message Blocked message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.IBlocked, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Blocked message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Blocked
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.Blocked;

            /**
             * Decodes a Blocked message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Blocked
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.Blocked;

            /**
             * Verifies a Blocked message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Blocked message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Blocked
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.Blocked;

            /**
             * Creates a plain object from a Blocked message. Also converts values to other types if specified.
             * @param message Blocked
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.Blocked, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Blocked to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Blocked
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Request. */
        interface IRequest {

            /** Request type */
            type?: (signalservice.SyncMessage.Request.Type|null);
        }

        /** Represents a Request. */
        class Request implements IRequest {

            /**
             * Constructs a new Request.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.IRequest);

            /** Request type. */
            public type: signalservice.SyncMessage.Request.Type;

            /**
             * Creates a new Request instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Request instance
             */
            public static create(properties?: signalservice.SyncMessage.IRequest): signalservice.SyncMessage.Request;

            /**
             * Encodes the specified Request message. Does not implicitly {@link signalservice.SyncMessage.Request.verify|verify} messages.
             * @param message Request message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.IRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Request message, length delimited. Does not implicitly {@link signalservice.SyncMessage.Request.verify|verify} messages.
             * @param message Request message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.IRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Request message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Request
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.Request;

            /**
             * Decodes a Request message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Request
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.Request;

            /**
             * Verifies a Request message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Request message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Request
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.Request;

            /**
             * Creates a plain object from a Request message. Also converts values to other types if specified.
             * @param message Request
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.Request, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Request to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Request
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace Request {

            /** Type enum. */
            enum Type {
                UNKNOWN = 0,
                CONTACTS = 1,
                BLOCKED = 3,
                CONFIGURATION = 4,
                KEYS = 5,
                PNI_IDENTITY = 6
            }
        }

        /** Properties of a Keys. */
        interface IKeys {

            /** Keys storageService */
            storageService?: (Uint8Array|null);

            /** Keys master */
            master?: (Uint8Array|null);
        }

        /** Represents a Keys. */
        class Keys implements IKeys {

            /**
             * Constructs a new Keys.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.IKeys);

            /** Keys storageService. */
            public storageService: Uint8Array;

            /** Keys master. */
            public master: Uint8Array;

            /**
             * Creates a new Keys instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Keys instance
             */
            public static create(properties?: signalservice.SyncMessage.IKeys): signalservice.SyncMessage.Keys;

            /**
             * Encodes the specified Keys message. Does not implicitly {@link signalservice.SyncMessage.Keys.verify|verify} messages.
             * @param message Keys message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.IKeys, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Keys message, length delimited. Does not implicitly {@link signalservice.SyncMessage.Keys.verify|verify} messages.
             * @param message Keys message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.IKeys, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Keys message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Keys
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.Keys;

            /**
             * Decodes a Keys message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Keys
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.Keys;

            /**
             * Verifies a Keys message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Keys message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Keys
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.Keys;

            /**
             * Creates a plain object from a Keys message. Also converts values to other types if specified.
             * @param message Keys
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.Keys, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Keys to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Keys
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Read. */
        interface IRead {

            /** Read sender */
            sender?: (string|null);

            /** Read senderAci */
            senderAci?: (string|null);

            /** Read timestamp */
            timestamp?: (number|Long|null);
        }

        /** Represents a Read. */
        class Read implements IRead {

            /**
             * Constructs a new Read.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.IRead);

            /** Read sender. */
            public sender: string;

            /** Read senderAci. */
            public senderAci: string;

            /** Read timestamp. */
            public timestamp: (number|Long);

            /**
             * Creates a new Read instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Read instance
             */
            public static create(properties?: signalservice.SyncMessage.IRead): signalservice.SyncMessage.Read;

            /**
             * Encodes the specified Read message. Does not implicitly {@link signalservice.SyncMessage.Read.verify|verify} messages.
             * @param message Read message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.IRead, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Read message, length delimited. Does not implicitly {@link signalservice.SyncMessage.Read.verify|verify} messages.
             * @param message Read message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.IRead, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Read message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Read
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.Read;

            /**
             * Decodes a Read message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Read
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.Read;

            /**
             * Verifies a Read message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Read message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Read
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.Read;

            /**
             * Creates a plain object from a Read message. Also converts values to other types if specified.
             * @param message Read
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.Read, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Read to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Read
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Viewed. */
        interface IViewed {

            /** Viewed senderE164 */
            senderE164?: (string|null);

            /** Viewed senderAci */
            senderAci?: (string|null);

            /** Viewed timestamp */
            timestamp?: (number|Long|null);
        }

        /** Represents a Viewed. */
        class Viewed implements IViewed {

            /**
             * Constructs a new Viewed.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.IViewed);

            /** Viewed senderE164. */
            public senderE164: string;

            /** Viewed senderAci. */
            public senderAci: string;

            /** Viewed timestamp. */
            public timestamp: (number|Long);

            /**
             * Creates a new Viewed instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Viewed instance
             */
            public static create(properties?: signalservice.SyncMessage.IViewed): signalservice.SyncMessage.Viewed;

            /**
             * Encodes the specified Viewed message. Does not implicitly {@link signalservice.SyncMessage.Viewed.verify|verify} messages.
             * @param message Viewed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.IViewed, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Viewed message, length delimited. Does not implicitly {@link signalservice.SyncMessage.Viewed.verify|verify} messages.
             * @param message Viewed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.IViewed, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Viewed message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Viewed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.Viewed;

            /**
             * Decodes a Viewed message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Viewed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.Viewed;

            /**
             * Verifies a Viewed message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Viewed message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Viewed
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.Viewed;

            /**
             * Creates a plain object from a Viewed message. Also converts values to other types if specified.
             * @param message Viewed
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.Viewed, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Viewed to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Viewed
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a Configuration. */
        interface IConfiguration {

            /** Configuration readReceipts */
            readReceipts?: (boolean|null);

            /** Configuration unidentifiedDeliveryIndicators */
            unidentifiedDeliveryIndicators?: (boolean|null);

            /** Configuration typingIndicators */
            typingIndicators?: (boolean|null);

            /** Configuration provisioningVersion */
            provisioningVersion?: (number|null);

            /** Configuration linkPreviews */
            linkPreviews?: (boolean|null);
        }

        /** Represents a Configuration. */
        class Configuration implements IConfiguration {

            /**
             * Constructs a new Configuration.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.IConfiguration);

            /** Configuration readReceipts. */
            public readReceipts: boolean;

            /** Configuration unidentifiedDeliveryIndicators. */
            public unidentifiedDeliveryIndicators: boolean;

            /** Configuration typingIndicators. */
            public typingIndicators: boolean;

            /** Configuration provisioningVersion. */
            public provisioningVersion: number;

            /** Configuration linkPreviews. */
            public linkPreviews: boolean;

            /**
             * Creates a new Configuration instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Configuration instance
             */
            public static create(properties?: signalservice.SyncMessage.IConfiguration): signalservice.SyncMessage.Configuration;

            /**
             * Encodes the specified Configuration message. Does not implicitly {@link signalservice.SyncMessage.Configuration.verify|verify} messages.
             * @param message Configuration message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.IConfiguration, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Configuration message, length delimited. Does not implicitly {@link signalservice.SyncMessage.Configuration.verify|verify} messages.
             * @param message Configuration message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.IConfiguration, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Configuration message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Configuration
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.Configuration;

            /**
             * Decodes a Configuration message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Configuration
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.Configuration;

            /**
             * Verifies a Configuration message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Configuration message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Configuration
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.Configuration;

            /**
             * Creates a plain object from a Configuration message. Also converts values to other types if specified.
             * @param message Configuration
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.Configuration, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Configuration to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Configuration
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a StickerPackOperation. */
        interface IStickerPackOperation {

            /** StickerPackOperation packId */
            packId?: (Uint8Array|null);

            /** StickerPackOperation packKey */
            packKey?: (Uint8Array|null);

            /** StickerPackOperation type */
            type?: (signalservice.SyncMessage.StickerPackOperation.Type|null);
        }

        /** Represents a StickerPackOperation. */
        class StickerPackOperation implements IStickerPackOperation {

            /**
             * Constructs a new StickerPackOperation.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.IStickerPackOperation);

            /** StickerPackOperation packId. */
            public packId: Uint8Array;

            /** StickerPackOperation packKey. */
            public packKey: Uint8Array;

            /** StickerPackOperation type. */
            public type: signalservice.SyncMessage.StickerPackOperation.Type;

            /**
             * Creates a new StickerPackOperation instance using the specified properties.
             * @param [properties] Properties to set
             * @returns StickerPackOperation instance
             */
            public static create(properties?: signalservice.SyncMessage.IStickerPackOperation): signalservice.SyncMessage.StickerPackOperation;

            /**
             * Encodes the specified StickerPackOperation message. Does not implicitly {@link signalservice.SyncMessage.StickerPackOperation.verify|verify} messages.
             * @param message StickerPackOperation message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.IStickerPackOperation, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified StickerPackOperation message, length delimited. Does not implicitly {@link signalservice.SyncMessage.StickerPackOperation.verify|verify} messages.
             * @param message StickerPackOperation message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.IStickerPackOperation, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a StickerPackOperation message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns StickerPackOperation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.StickerPackOperation;

            /**
             * Decodes a StickerPackOperation message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns StickerPackOperation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.StickerPackOperation;

            /**
             * Verifies a StickerPackOperation message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a StickerPackOperation message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns StickerPackOperation
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.StickerPackOperation;

            /**
             * Creates a plain object from a StickerPackOperation message. Also converts values to other types if specified.
             * @param message StickerPackOperation
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.StickerPackOperation, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this StickerPackOperation to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for StickerPackOperation
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace StickerPackOperation {

            /** Type enum. */
            enum Type {
                INSTALL = 0,
                REMOVE = 1
            }
        }

        /** Properties of a ViewOnceOpen. */
        interface IViewOnceOpen {

            /** ViewOnceOpen sender */
            sender?: (string|null);

            /** ViewOnceOpen senderAci */
            senderAci?: (string|null);

            /** ViewOnceOpen timestamp */
            timestamp?: (number|Long|null);
        }

        /** Represents a ViewOnceOpen. */
        class ViewOnceOpen implements IViewOnceOpen {

            /**
             * Constructs a new ViewOnceOpen.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.IViewOnceOpen);

            /** ViewOnceOpen sender. */
            public sender: string;

            /** ViewOnceOpen senderAci. */
            public senderAci: string;

            /** ViewOnceOpen timestamp. */
            public timestamp: (number|Long);

            /**
             * Creates a new ViewOnceOpen instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ViewOnceOpen instance
             */
            public static create(properties?: signalservice.SyncMessage.IViewOnceOpen): signalservice.SyncMessage.ViewOnceOpen;

            /**
             * Encodes the specified ViewOnceOpen message. Does not implicitly {@link signalservice.SyncMessage.ViewOnceOpen.verify|verify} messages.
             * @param message ViewOnceOpen message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.IViewOnceOpen, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ViewOnceOpen message, length delimited. Does not implicitly {@link signalservice.SyncMessage.ViewOnceOpen.verify|verify} messages.
             * @param message ViewOnceOpen message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.IViewOnceOpen, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ViewOnceOpen message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ViewOnceOpen
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.ViewOnceOpen;

            /**
             * Decodes a ViewOnceOpen message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ViewOnceOpen
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.ViewOnceOpen;

            /**
             * Verifies a ViewOnceOpen message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ViewOnceOpen message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ViewOnceOpen
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.ViewOnceOpen;

            /**
             * Creates a plain object from a ViewOnceOpen message. Also converts values to other types if specified.
             * @param message ViewOnceOpen
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.ViewOnceOpen, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ViewOnceOpen to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ViewOnceOpen
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a MessageRequestResponse. */
        interface IMessageRequestResponse {

            /** MessageRequestResponse threadE164 */
            threadE164?: (string|null);

            /** MessageRequestResponse threadAci */
            threadAci?: (string|null);

            /** MessageRequestResponse groupId */
            groupId?: (Uint8Array|null);

            /** MessageRequestResponse type */
            type?: (signalservice.SyncMessage.MessageRequestResponse.Type|null);
        }

        /** Represents a MessageRequestResponse. */
        class MessageRequestResponse implements IMessageRequestResponse {

            /**
             * Constructs a new MessageRequestResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.IMessageRequestResponse);

            /** MessageRequestResponse threadE164. */
            public threadE164: string;

            /** MessageRequestResponse threadAci. */
            public threadAci: string;

            /** MessageRequestResponse groupId. */
            public groupId: Uint8Array;

            /** MessageRequestResponse type. */
            public type: signalservice.SyncMessage.MessageRequestResponse.Type;

            /**
             * Creates a new MessageRequestResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MessageRequestResponse instance
             */
            public static create(properties?: signalservice.SyncMessage.IMessageRequestResponse): signalservice.SyncMessage.MessageRequestResponse;

            /**
             * Encodes the specified MessageRequestResponse message. Does not implicitly {@link signalservice.SyncMessage.MessageRequestResponse.verify|verify} messages.
             * @param message MessageRequestResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.IMessageRequestResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MessageRequestResponse message, length delimited. Does not implicitly {@link signalservice.SyncMessage.MessageRequestResponse.verify|verify} messages.
             * @param message MessageRequestResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.IMessageRequestResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MessageRequestResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MessageRequestResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.MessageRequestResponse;

            /**
             * Decodes a MessageRequestResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MessageRequestResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.MessageRequestResponse;

            /**
             * Verifies a MessageRequestResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MessageRequestResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MessageRequestResponse
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.MessageRequestResponse;

            /**
             * Creates a plain object from a MessageRequestResponse message. Also converts values to other types if specified.
             * @param message MessageRequestResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.MessageRequestResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MessageRequestResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for MessageRequestResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace MessageRequestResponse {

            /** Type enum. */
            enum Type {
                UNKNOWN = 0,
                ACCEPT = 1,
                DELETE = 2,
                BLOCK = 3,
                BLOCK_AND_DELETE = 4,
                SPAM = 5,
                BLOCK_AND_SPAM = 6
            }
        }

        /** Properties of a FetchLatest. */
        interface IFetchLatest {

            /** FetchLatest type */
            type?: (signalservice.SyncMessage.FetchLatest.Type|null);
        }

        /** Represents a FetchLatest. */
        class FetchLatest implements IFetchLatest {

            /**
             * Constructs a new FetchLatest.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.IFetchLatest);

            /** FetchLatest type. */
            public type: signalservice.SyncMessage.FetchLatest.Type;

            /**
             * Creates a new FetchLatest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FetchLatest instance
             */
            public static create(properties?: signalservice.SyncMessage.IFetchLatest): signalservice.SyncMessage.FetchLatest;

            /**
             * Encodes the specified FetchLatest message. Does not implicitly {@link signalservice.SyncMessage.FetchLatest.verify|verify} messages.
             * @param message FetchLatest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.IFetchLatest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FetchLatest message, length delimited. Does not implicitly {@link signalservice.SyncMessage.FetchLatest.verify|verify} messages.
             * @param message FetchLatest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.IFetchLatest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FetchLatest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FetchLatest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.FetchLatest;

            /**
             * Decodes a FetchLatest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FetchLatest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.FetchLatest;

            /**
             * Verifies a FetchLatest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FetchLatest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FetchLatest
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.FetchLatest;

            /**
             * Creates a plain object from a FetchLatest message. Also converts values to other types if specified.
             * @param message FetchLatest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.FetchLatest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FetchLatest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for FetchLatest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace FetchLatest {

            /** Type enum. */
            enum Type {
                UNKNOWN = 0,
                LOCAL_PROFILE = 1,
                STORAGE_MANIFEST = 2,
                SUBSCRIPTION_STATUS = 3
            }
        }

        /** Properties of a PniChangeNumber. */
        interface IPniChangeNumber {

            /** PniChangeNumber identityKeyPair */
            identityKeyPair?: (Uint8Array|null);

            /** PniChangeNumber signedPreKey */
            signedPreKey?: (Uint8Array|null);

            /** PniChangeNumber lastResortKyberPreKey */
            lastResortKyberPreKey?: (Uint8Array|null);

            /** PniChangeNumber registrationId */
            registrationId?: (number|null);

            /** PniChangeNumber newE164 */
            newE164?: (string|null);
        }

        /** Represents a PniChangeNumber. */
        class PniChangeNumber implements IPniChangeNumber {

            /**
             * Constructs a new PniChangeNumber.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.IPniChangeNumber);

            /** PniChangeNumber identityKeyPair. */
            public identityKeyPair: Uint8Array;

            /** PniChangeNumber signedPreKey. */
            public signedPreKey: Uint8Array;

            /** PniChangeNumber lastResortKyberPreKey. */
            public lastResortKyberPreKey: Uint8Array;

            /** PniChangeNumber registrationId. */
            public registrationId: number;

            /** PniChangeNumber newE164. */
            public newE164: string;

            /**
             * Creates a new PniChangeNumber instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PniChangeNumber instance
             */
            public static create(properties?: signalservice.SyncMessage.IPniChangeNumber): signalservice.SyncMessage.PniChangeNumber;

            /**
             * Encodes the specified PniChangeNumber message. Does not implicitly {@link signalservice.SyncMessage.PniChangeNumber.verify|verify} messages.
             * @param message PniChangeNumber message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.IPniChangeNumber, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PniChangeNumber message, length delimited. Does not implicitly {@link signalservice.SyncMessage.PniChangeNumber.verify|verify} messages.
             * @param message PniChangeNumber message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.IPniChangeNumber, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PniChangeNumber message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PniChangeNumber
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.PniChangeNumber;

            /**
             * Decodes a PniChangeNumber message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PniChangeNumber
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.PniChangeNumber;

            /**
             * Verifies a PniChangeNumber message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PniChangeNumber message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PniChangeNumber
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.PniChangeNumber;

            /**
             * Creates a plain object from a PniChangeNumber message. Also converts values to other types if specified.
             * @param message PniChangeNumber
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.PniChangeNumber, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PniChangeNumber to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for PniChangeNumber
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CallEvent. */
        interface ICallEvent {

            /** CallEvent peerId */
            peerId?: (Uint8Array|null);

            /** CallEvent callId */
            callId?: (number|Long|null);

            /** CallEvent timestamp */
            timestamp?: (number|Long|null);

            /** CallEvent type */
            type?: (signalservice.SyncMessage.CallEvent.Type|null);

            /** CallEvent direction */
            direction?: (signalservice.SyncMessage.CallEvent.Direction|null);

            /** CallEvent event */
            event?: (signalservice.SyncMessage.CallEvent.Event|null);
        }

        /** Represents a CallEvent. */
        class CallEvent implements ICallEvent {

            /**
             * Constructs a new CallEvent.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.ICallEvent);

            /** CallEvent peerId. */
            public peerId: Uint8Array;

            /** CallEvent callId. */
            public callId: (number|Long);

            /** CallEvent timestamp. */
            public timestamp: (number|Long);

            /** CallEvent type. */
            public type: signalservice.SyncMessage.CallEvent.Type;

            /** CallEvent direction. */
            public direction: signalservice.SyncMessage.CallEvent.Direction;

            /** CallEvent event. */
            public event: signalservice.SyncMessage.CallEvent.Event;

            /**
             * Creates a new CallEvent instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CallEvent instance
             */
            public static create(properties?: signalservice.SyncMessage.ICallEvent): signalservice.SyncMessage.CallEvent;

            /**
             * Encodes the specified CallEvent message. Does not implicitly {@link signalservice.SyncMessage.CallEvent.verify|verify} messages.
             * @param message CallEvent message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.ICallEvent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CallEvent message, length delimited. Does not implicitly {@link signalservice.SyncMessage.CallEvent.verify|verify} messages.
             * @param message CallEvent message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.ICallEvent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CallEvent message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CallEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.CallEvent;

            /**
             * Decodes a CallEvent message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CallEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.CallEvent;

            /**
             * Verifies a CallEvent message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CallEvent message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CallEvent
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.CallEvent;

            /**
             * Creates a plain object from a CallEvent message. Also converts values to other types if specified.
             * @param message CallEvent
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.CallEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CallEvent to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CallEvent
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace CallEvent {

            /** Type enum. */
            enum Type {
                UNKNOWN = 0,
                AUDIO_CALL = 1,
                VIDEO_CALL = 2,
                GROUP_CALL = 3,
                AD_HOC_CALL = 4
            }

            /** Direction enum. */
            enum Direction {
                UNKNOWN = 0,
                INCOMING = 1,
                OUTGOING = 2
            }

            /** Event enum. */
            enum Event {
                UNKNOWN = 0,
                ACCEPTED = 1,
                NOT_ACCEPTED = 2,
                DELETE = 3,
                OBSERVED = 4
            }
        }

        /** Properties of a CallLinkUpdate. */
        interface ICallLinkUpdate {

            /** CallLinkUpdate rootKey */
            rootKey?: (Uint8Array|null);

            /** CallLinkUpdate adminPasskey */
            adminPasskey?: (Uint8Array|null);

            /** CallLinkUpdate type */
            type?: (signalservice.SyncMessage.CallLinkUpdate.Type|null);
        }

        /** Represents a CallLinkUpdate. */
        class CallLinkUpdate implements ICallLinkUpdate {

            /**
             * Constructs a new CallLinkUpdate.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.ICallLinkUpdate);

            /** CallLinkUpdate rootKey. */
            public rootKey: Uint8Array;

            /** CallLinkUpdate adminPasskey. */
            public adminPasskey: Uint8Array;

            /** CallLinkUpdate type. */
            public type: signalservice.SyncMessage.CallLinkUpdate.Type;

            /**
             * Creates a new CallLinkUpdate instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CallLinkUpdate instance
             */
            public static create(properties?: signalservice.SyncMessage.ICallLinkUpdate): signalservice.SyncMessage.CallLinkUpdate;

            /**
             * Encodes the specified CallLinkUpdate message. Does not implicitly {@link signalservice.SyncMessage.CallLinkUpdate.verify|verify} messages.
             * @param message CallLinkUpdate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.ICallLinkUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CallLinkUpdate message, length delimited. Does not implicitly {@link signalservice.SyncMessage.CallLinkUpdate.verify|verify} messages.
             * @param message CallLinkUpdate message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.ICallLinkUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CallLinkUpdate message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CallLinkUpdate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.CallLinkUpdate;

            /**
             * Decodes a CallLinkUpdate message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CallLinkUpdate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.CallLinkUpdate;

            /**
             * Verifies a CallLinkUpdate message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CallLinkUpdate message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CallLinkUpdate
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.CallLinkUpdate;

            /**
             * Creates a plain object from a CallLinkUpdate message. Also converts values to other types if specified.
             * @param message CallLinkUpdate
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.CallLinkUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CallLinkUpdate to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CallLinkUpdate
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace CallLinkUpdate {

            /** Type enum. */
            enum Type {
                UPDATE = 0,
                DELETE = 1
            }
        }

        /** Properties of a CallLogEvent. */
        interface ICallLogEvent {

            /** CallLogEvent type */
            type?: (signalservice.SyncMessage.CallLogEvent.Type|null);

            /** CallLogEvent timestamp */
            timestamp?: (number|Long|null);

            /** CallLogEvent peerId */
            peerId?: (Uint8Array|null);

            /** CallLogEvent callId */
            callId?: (number|Long|null);
        }

        /** Represents a CallLogEvent. */
        class CallLogEvent implements ICallLogEvent {

            /**
             * Constructs a new CallLogEvent.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.ICallLogEvent);

            /** CallLogEvent type. */
            public type: signalservice.SyncMessage.CallLogEvent.Type;

            /** CallLogEvent timestamp. */
            public timestamp: (number|Long);

            /** CallLogEvent peerId. */
            public peerId: Uint8Array;

            /** CallLogEvent callId. */
            public callId: (number|Long);

            /**
             * Creates a new CallLogEvent instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CallLogEvent instance
             */
            public static create(properties?: signalservice.SyncMessage.ICallLogEvent): signalservice.SyncMessage.CallLogEvent;

            /**
             * Encodes the specified CallLogEvent message. Does not implicitly {@link signalservice.SyncMessage.CallLogEvent.verify|verify} messages.
             * @param message CallLogEvent message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.ICallLogEvent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CallLogEvent message, length delimited. Does not implicitly {@link signalservice.SyncMessage.CallLogEvent.verify|verify} messages.
             * @param message CallLogEvent message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.ICallLogEvent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CallLogEvent message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CallLogEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.CallLogEvent;

            /**
             * Decodes a CallLogEvent message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CallLogEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.CallLogEvent;

            /**
             * Verifies a CallLogEvent message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CallLogEvent message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CallLogEvent
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.CallLogEvent;

            /**
             * Creates a plain object from a CallLogEvent message. Also converts values to other types if specified.
             * @param message CallLogEvent
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.CallLogEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CallLogEvent to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CallLogEvent
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace CallLogEvent {

            /** Type enum. */
            enum Type {
                CLEAR = 0,
                MARKED_AS_READ = 1,
                MARKED_AS_READ_IN_CONVERSATION = 2
            }
        }

        /** Properties of a DeleteForMe. */
        interface IDeleteForMe {

            /** DeleteForMe messageDeletes */
            messageDeletes?: (signalservice.SyncMessage.DeleteForMe.IMessageDeletes[]|null);

            /** DeleteForMe conversationDeletes */
            conversationDeletes?: (signalservice.SyncMessage.DeleteForMe.IConversationDelete[]|null);

            /** DeleteForMe localOnlyConversationDeletes */
            localOnlyConversationDeletes?: (signalservice.SyncMessage.DeleteForMe.ILocalOnlyConversationDelete[]|null);

            /** DeleteForMe attachmentDeletes */
            attachmentDeletes?: (signalservice.SyncMessage.DeleteForMe.IAttachmentDelete[]|null);
        }

        /** Represents a DeleteForMe. */
        class DeleteForMe implements IDeleteForMe {

            /**
             * Constructs a new DeleteForMe.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.SyncMessage.IDeleteForMe);

            /** DeleteForMe messageDeletes. */
            public messageDeletes: signalservice.SyncMessage.DeleteForMe.IMessageDeletes[];

            /** DeleteForMe conversationDeletes. */
            public conversationDeletes: signalservice.SyncMessage.DeleteForMe.IConversationDelete[];

            /** DeleteForMe localOnlyConversationDeletes. */
            public localOnlyConversationDeletes: signalservice.SyncMessage.DeleteForMe.ILocalOnlyConversationDelete[];

            /** DeleteForMe attachmentDeletes. */
            public attachmentDeletes: signalservice.SyncMessage.DeleteForMe.IAttachmentDelete[];

            /**
             * Creates a new DeleteForMe instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DeleteForMe instance
             */
            public static create(properties?: signalservice.SyncMessage.IDeleteForMe): signalservice.SyncMessage.DeleteForMe;

            /**
             * Encodes the specified DeleteForMe message. Does not implicitly {@link signalservice.SyncMessage.DeleteForMe.verify|verify} messages.
             * @param message DeleteForMe message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.SyncMessage.IDeleteForMe, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DeleteForMe message, length delimited. Does not implicitly {@link signalservice.SyncMessage.DeleteForMe.verify|verify} messages.
             * @param message DeleteForMe message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.SyncMessage.IDeleteForMe, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DeleteForMe message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DeleteForMe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.DeleteForMe;

            /**
             * Decodes a DeleteForMe message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DeleteForMe
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.DeleteForMe;

            /**
             * Verifies a DeleteForMe message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DeleteForMe message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DeleteForMe
             */
            public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.DeleteForMe;

            /**
             * Creates a plain object from a DeleteForMe message. Also converts values to other types if specified.
             * @param message DeleteForMe
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.SyncMessage.DeleteForMe, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DeleteForMe to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DeleteForMe
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace DeleteForMe {

            /** Properties of a ConversationIdentifier. */
            interface IConversationIdentifier {

                /** ConversationIdentifier threadServiceId */
                threadServiceId?: (string|null);

                /** ConversationIdentifier threadGroupId */
                threadGroupId?: (Uint8Array|null);

                /** ConversationIdentifier threadE164 */
                threadE164?: (string|null);
            }

            /** Represents a ConversationIdentifier. */
            class ConversationIdentifier implements IConversationIdentifier {

                /**
                 * Constructs a new ConversationIdentifier.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.SyncMessage.DeleteForMe.IConversationIdentifier);

                /** ConversationIdentifier threadServiceId. */
                public threadServiceId?: (string|null);

                /** ConversationIdentifier threadGroupId. */
                public threadGroupId?: (Uint8Array|null);

                /** ConversationIdentifier threadE164. */
                public threadE164?: (string|null);

                /** ConversationIdentifier identifier. */
                public identifier?: ("threadServiceId"|"threadGroupId"|"threadE164");

                /**
                 * Creates a new ConversationIdentifier instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ConversationIdentifier instance
                 */
                public static create(properties?: signalservice.SyncMessage.DeleteForMe.IConversationIdentifier): signalservice.SyncMessage.DeleteForMe.ConversationIdentifier;

                /**
                 * Encodes the specified ConversationIdentifier message. Does not implicitly {@link signalservice.SyncMessage.DeleteForMe.ConversationIdentifier.verify|verify} messages.
                 * @param message ConversationIdentifier message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.SyncMessage.DeleteForMe.IConversationIdentifier, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ConversationIdentifier message, length delimited. Does not implicitly {@link signalservice.SyncMessage.DeleteForMe.ConversationIdentifier.verify|verify} messages.
                 * @param message ConversationIdentifier message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.SyncMessage.DeleteForMe.IConversationIdentifier, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ConversationIdentifier message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ConversationIdentifier
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.DeleteForMe.ConversationIdentifier;

                /**
                 * Decodes a ConversationIdentifier message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ConversationIdentifier
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.DeleteForMe.ConversationIdentifier;

                /**
                 * Verifies a ConversationIdentifier message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ConversationIdentifier message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ConversationIdentifier
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.DeleteForMe.ConversationIdentifier;

                /**
                 * Creates a plain object from a ConversationIdentifier message. Also converts values to other types if specified.
                 * @param message ConversationIdentifier
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.SyncMessage.DeleteForMe.ConversationIdentifier, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ConversationIdentifier to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ConversationIdentifier
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an AddressableMessage. */
            interface IAddressableMessage {

                /** AddressableMessage authorServiceId */
                authorServiceId?: (string|null);

                /** AddressableMessage authorE164 */
                authorE164?: (string|null);

                /** AddressableMessage sentTimestamp */
                sentTimestamp?: (number|Long|null);
            }

            /** Represents an AddressableMessage. */
            class AddressableMessage implements IAddressableMessage {

                /**
                 * Constructs a new AddressableMessage.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.SyncMessage.DeleteForMe.IAddressableMessage);

                /** AddressableMessage authorServiceId. */
                public authorServiceId?: (string|null);

                /** AddressableMessage authorE164. */
                public authorE164?: (string|null);

                /** AddressableMessage sentTimestamp. */
                public sentTimestamp: (number|Long);

                /** AddressableMessage author. */
                public author?: ("authorServiceId"|"authorE164");

                /**
                 * Creates a new AddressableMessage instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns AddressableMessage instance
                 */
                public static create(properties?: signalservice.SyncMessage.DeleteForMe.IAddressableMessage): signalservice.SyncMessage.DeleteForMe.AddressableMessage;

                /**
                 * Encodes the specified AddressableMessage message. Does not implicitly {@link signalservice.SyncMessage.DeleteForMe.AddressableMessage.verify|verify} messages.
                 * @param message AddressableMessage message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.SyncMessage.DeleteForMe.IAddressableMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified AddressableMessage message, length delimited. Does not implicitly {@link signalservice.SyncMessage.DeleteForMe.AddressableMessage.verify|verify} messages.
                 * @param message AddressableMessage message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.SyncMessage.DeleteForMe.IAddressableMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an AddressableMessage message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns AddressableMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.DeleteForMe.AddressableMessage;

                /**
                 * Decodes an AddressableMessage message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns AddressableMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.DeleteForMe.AddressableMessage;

                /**
                 * Verifies an AddressableMessage message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an AddressableMessage message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns AddressableMessage
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.DeleteForMe.AddressableMessage;

                /**
                 * Creates a plain object from an AddressableMessage message. Also converts values to other types if specified.
                 * @param message AddressableMessage
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.SyncMessage.DeleteForMe.AddressableMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this AddressableMessage to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for AddressableMessage
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a MessageDeletes. */
            interface IMessageDeletes {

                /** MessageDeletes conversation */
                conversation?: (signalservice.SyncMessage.DeleteForMe.IConversationIdentifier|null);

                /** MessageDeletes messages */
                messages?: (signalservice.SyncMessage.DeleteForMe.IAddressableMessage[]|null);
            }

            /** Represents a MessageDeletes. */
            class MessageDeletes implements IMessageDeletes {

                /**
                 * Constructs a new MessageDeletes.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.SyncMessage.DeleteForMe.IMessageDeletes);

                /** MessageDeletes conversation. */
                public conversation?: (signalservice.SyncMessage.DeleteForMe.IConversationIdentifier|null);

                /** MessageDeletes messages. */
                public messages: signalservice.SyncMessage.DeleteForMe.IAddressableMessage[];

                /**
                 * Creates a new MessageDeletes instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns MessageDeletes instance
                 */
                public static create(properties?: signalservice.SyncMessage.DeleteForMe.IMessageDeletes): signalservice.SyncMessage.DeleteForMe.MessageDeletes;

                /**
                 * Encodes the specified MessageDeletes message. Does not implicitly {@link signalservice.SyncMessage.DeleteForMe.MessageDeletes.verify|verify} messages.
                 * @param message MessageDeletes message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.SyncMessage.DeleteForMe.IMessageDeletes, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified MessageDeletes message, length delimited. Does not implicitly {@link signalservice.SyncMessage.DeleteForMe.MessageDeletes.verify|verify} messages.
                 * @param message MessageDeletes message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.SyncMessage.DeleteForMe.IMessageDeletes, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a MessageDeletes message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns MessageDeletes
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.DeleteForMe.MessageDeletes;

                /**
                 * Decodes a MessageDeletes message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns MessageDeletes
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.DeleteForMe.MessageDeletes;

                /**
                 * Verifies a MessageDeletes message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a MessageDeletes message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns MessageDeletes
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.DeleteForMe.MessageDeletes;

                /**
                 * Creates a plain object from a MessageDeletes message. Also converts values to other types if specified.
                 * @param message MessageDeletes
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.SyncMessage.DeleteForMe.MessageDeletes, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this MessageDeletes to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for MessageDeletes
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an AttachmentDelete. */
            interface IAttachmentDelete {

                /** AttachmentDelete conversation */
                conversation?: (signalservice.SyncMessage.DeleteForMe.IConversationIdentifier|null);

                /** AttachmentDelete targetMessage */
                targetMessage?: (signalservice.SyncMessage.DeleteForMe.IAddressableMessage|null);

                /** AttachmentDelete clientUuid */
                clientUuid?: (Uint8Array|null);

                /** AttachmentDelete fallbackDigest */
                fallbackDigest?: (Uint8Array|null);

                /** AttachmentDelete fallbackPlaintextHash */
                fallbackPlaintextHash?: (Uint8Array|null);
            }

            /** Represents an AttachmentDelete. */
            class AttachmentDelete implements IAttachmentDelete {

                /**
                 * Constructs a new AttachmentDelete.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.SyncMessage.DeleteForMe.IAttachmentDelete);

                /** AttachmentDelete conversation. */
                public conversation?: (signalservice.SyncMessage.DeleteForMe.IConversationIdentifier|null);

                /** AttachmentDelete targetMessage. */
                public targetMessage?: (signalservice.SyncMessage.DeleteForMe.IAddressableMessage|null);

                /** AttachmentDelete clientUuid. */
                public clientUuid: Uint8Array;

                /** AttachmentDelete fallbackDigest. */
                public fallbackDigest: Uint8Array;

                /** AttachmentDelete fallbackPlaintextHash. */
                public fallbackPlaintextHash: Uint8Array;

                /**
                 * Creates a new AttachmentDelete instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns AttachmentDelete instance
                 */
                public static create(properties?: signalservice.SyncMessage.DeleteForMe.IAttachmentDelete): signalservice.SyncMessage.DeleteForMe.AttachmentDelete;

                /**
                 * Encodes the specified AttachmentDelete message. Does not implicitly {@link signalservice.SyncMessage.DeleteForMe.AttachmentDelete.verify|verify} messages.
                 * @param message AttachmentDelete message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.SyncMessage.DeleteForMe.IAttachmentDelete, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified AttachmentDelete message, length delimited. Does not implicitly {@link signalservice.SyncMessage.DeleteForMe.AttachmentDelete.verify|verify} messages.
                 * @param message AttachmentDelete message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.SyncMessage.DeleteForMe.IAttachmentDelete, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an AttachmentDelete message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns AttachmentDelete
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.DeleteForMe.AttachmentDelete;

                /**
                 * Decodes an AttachmentDelete message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns AttachmentDelete
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.DeleteForMe.AttachmentDelete;

                /**
                 * Verifies an AttachmentDelete message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an AttachmentDelete message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns AttachmentDelete
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.DeleteForMe.AttachmentDelete;

                /**
                 * Creates a plain object from an AttachmentDelete message. Also converts values to other types if specified.
                 * @param message AttachmentDelete
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.SyncMessage.DeleteForMe.AttachmentDelete, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this AttachmentDelete to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for AttachmentDelete
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a ConversationDelete. */
            interface IConversationDelete {

                /** ConversationDelete conversation */
                conversation?: (signalservice.SyncMessage.DeleteForMe.IConversationIdentifier|null);

                /** ConversationDelete mostRecentMessages */
                mostRecentMessages?: (signalservice.SyncMessage.DeleteForMe.IAddressableMessage[]|null);

                /** ConversationDelete isFullDelete */
                isFullDelete?: (boolean|null);

                /** ConversationDelete mostRecentNonExpiringMessages */
                mostRecentNonExpiringMessages?: (signalservice.SyncMessage.DeleteForMe.IAddressableMessage[]|null);
            }

            /** Represents a ConversationDelete. */
            class ConversationDelete implements IConversationDelete {

                /**
                 * Constructs a new ConversationDelete.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.SyncMessage.DeleteForMe.IConversationDelete);

                /** ConversationDelete conversation. */
                public conversation?: (signalservice.SyncMessage.DeleteForMe.IConversationIdentifier|null);

                /** ConversationDelete mostRecentMessages. */
                public mostRecentMessages: signalservice.SyncMessage.DeleteForMe.IAddressableMessage[];

                /** ConversationDelete isFullDelete. */
                public isFullDelete: boolean;

                /** ConversationDelete mostRecentNonExpiringMessages. */
                public mostRecentNonExpiringMessages: signalservice.SyncMessage.DeleteForMe.IAddressableMessage[];

                /**
                 * Creates a new ConversationDelete instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ConversationDelete instance
                 */
                public static create(properties?: signalservice.SyncMessage.DeleteForMe.IConversationDelete): signalservice.SyncMessage.DeleteForMe.ConversationDelete;

                /**
                 * Encodes the specified ConversationDelete message. Does not implicitly {@link signalservice.SyncMessage.DeleteForMe.ConversationDelete.verify|verify} messages.
                 * @param message ConversationDelete message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.SyncMessage.DeleteForMe.IConversationDelete, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ConversationDelete message, length delimited. Does not implicitly {@link signalservice.SyncMessage.DeleteForMe.ConversationDelete.verify|verify} messages.
                 * @param message ConversationDelete message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.SyncMessage.DeleteForMe.IConversationDelete, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ConversationDelete message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ConversationDelete
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.DeleteForMe.ConversationDelete;

                /**
                 * Decodes a ConversationDelete message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ConversationDelete
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.DeleteForMe.ConversationDelete;

                /**
                 * Verifies a ConversationDelete message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ConversationDelete message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ConversationDelete
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.DeleteForMe.ConversationDelete;

                /**
                 * Creates a plain object from a ConversationDelete message. Also converts values to other types if specified.
                 * @param message ConversationDelete
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.SyncMessage.DeleteForMe.ConversationDelete, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ConversationDelete to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ConversationDelete
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a LocalOnlyConversationDelete. */
            interface ILocalOnlyConversationDelete {

                /** LocalOnlyConversationDelete conversation */
                conversation?: (signalservice.SyncMessage.DeleteForMe.IConversationIdentifier|null);
            }

            /** Represents a LocalOnlyConversationDelete. */
            class LocalOnlyConversationDelete implements ILocalOnlyConversationDelete {

                /**
                 * Constructs a new LocalOnlyConversationDelete.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: signalservice.SyncMessage.DeleteForMe.ILocalOnlyConversationDelete);

                /** LocalOnlyConversationDelete conversation. */
                public conversation?: (signalservice.SyncMessage.DeleteForMe.IConversationIdentifier|null);

                /**
                 * Creates a new LocalOnlyConversationDelete instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns LocalOnlyConversationDelete instance
                 */
                public static create(properties?: signalservice.SyncMessage.DeleteForMe.ILocalOnlyConversationDelete): signalservice.SyncMessage.DeleteForMe.LocalOnlyConversationDelete;

                /**
                 * Encodes the specified LocalOnlyConversationDelete message. Does not implicitly {@link signalservice.SyncMessage.DeleteForMe.LocalOnlyConversationDelete.verify|verify} messages.
                 * @param message LocalOnlyConversationDelete message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: signalservice.SyncMessage.DeleteForMe.ILocalOnlyConversationDelete, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified LocalOnlyConversationDelete message, length delimited. Does not implicitly {@link signalservice.SyncMessage.DeleteForMe.LocalOnlyConversationDelete.verify|verify} messages.
                 * @param message LocalOnlyConversationDelete message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: signalservice.SyncMessage.DeleteForMe.ILocalOnlyConversationDelete, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a LocalOnlyConversationDelete message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns LocalOnlyConversationDelete
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.SyncMessage.DeleteForMe.LocalOnlyConversationDelete;

                /**
                 * Decodes a LocalOnlyConversationDelete message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns LocalOnlyConversationDelete
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.SyncMessage.DeleteForMe.LocalOnlyConversationDelete;

                /**
                 * Verifies a LocalOnlyConversationDelete message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a LocalOnlyConversationDelete message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns LocalOnlyConversationDelete
                 */
                public static fromObject(object: { [k: string]: any }): signalservice.SyncMessage.DeleteForMe.LocalOnlyConversationDelete;

                /**
                 * Creates a plain object from a LocalOnlyConversationDelete message. Also converts values to other types if specified.
                 * @param message LocalOnlyConversationDelete
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: signalservice.SyncMessage.DeleteForMe.LocalOnlyConversationDelete, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this LocalOnlyConversationDelete to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for LocalOnlyConversationDelete
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }

    /** Properties of an AttachmentPointer. */
    interface IAttachmentPointer {

        /** AttachmentPointer cdnId */
        cdnId?: (number|Long|null);

        /** AttachmentPointer cdnKey */
        cdnKey?: (string|null);

        /** AttachmentPointer clientUuid */
        clientUuid?: (Uint8Array|null);

        /** AttachmentPointer contentType */
        contentType?: (string|null);

        /** AttachmentPointer key */
        key?: (Uint8Array|null);

        /** AttachmentPointer size */
        size?: (number|null);

        /** AttachmentPointer thumbnail */
        thumbnail?: (Uint8Array|null);

        /** AttachmentPointer digest */
        digest?: (Uint8Array|null);

        /** AttachmentPointer incrementalMac */
        incrementalMac?: (Uint8Array|null);

        /** AttachmentPointer chunkSize */
        chunkSize?: (number|null);

        /** AttachmentPointer fileName */
        fileName?: (string|null);

        /** AttachmentPointer flags */
        flags?: (number|null);

        /** AttachmentPointer width */
        width?: (number|null);

        /** AttachmentPointer height */
        height?: (number|null);

        /** AttachmentPointer caption */
        caption?: (string|null);

        /** AttachmentPointer blurHash */
        blurHash?: (string|null);

        /** AttachmentPointer uploadTimestamp */
        uploadTimestamp?: (number|Long|null);

        /** AttachmentPointer cdnNumber */
        cdnNumber?: (number|null);
    }

    /** Represents an AttachmentPointer. */
    class AttachmentPointer implements IAttachmentPointer {

        /**
         * Constructs a new AttachmentPointer.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IAttachmentPointer);

        /** AttachmentPointer cdnId. */
        public cdnId?: (number|Long|null);

        /** AttachmentPointer cdnKey. */
        public cdnKey?: (string|null);

        /** AttachmentPointer clientUuid. */
        public clientUuid: Uint8Array;

        /** AttachmentPointer contentType. */
        public contentType: string;

        /** AttachmentPointer key. */
        public key: Uint8Array;

        /** AttachmentPointer size. */
        public size: number;

        /** AttachmentPointer thumbnail. */
        public thumbnail: Uint8Array;

        /** AttachmentPointer digest. */
        public digest: Uint8Array;

        /** AttachmentPointer incrementalMac. */
        public incrementalMac: Uint8Array;

        /** AttachmentPointer chunkSize. */
        public chunkSize: number;

        /** AttachmentPointer fileName. */
        public fileName: string;

        /** AttachmentPointer flags. */
        public flags: number;

        /** AttachmentPointer width. */
        public width: number;

        /** AttachmentPointer height. */
        public height: number;

        /** AttachmentPointer caption. */
        public caption: string;

        /** AttachmentPointer blurHash. */
        public blurHash: string;

        /** AttachmentPointer uploadTimestamp. */
        public uploadTimestamp: (number|Long);

        /** AttachmentPointer cdnNumber. */
        public cdnNumber: number;

        /** AttachmentPointer attachmentIdentifier. */
        public attachmentIdentifier?: ("cdnId"|"cdnKey");

        /**
         * Creates a new AttachmentPointer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AttachmentPointer instance
         */
        public static create(properties?: signalservice.IAttachmentPointer): signalservice.AttachmentPointer;

        /**
         * Encodes the specified AttachmentPointer message. Does not implicitly {@link signalservice.AttachmentPointer.verify|verify} messages.
         * @param message AttachmentPointer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IAttachmentPointer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AttachmentPointer message, length delimited. Does not implicitly {@link signalservice.AttachmentPointer.verify|verify} messages.
         * @param message AttachmentPointer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IAttachmentPointer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AttachmentPointer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AttachmentPointer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.AttachmentPointer;

        /**
         * Decodes an AttachmentPointer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AttachmentPointer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.AttachmentPointer;

        /**
         * Verifies an AttachmentPointer message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AttachmentPointer message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AttachmentPointer
         */
        public static fromObject(object: { [k: string]: any }): signalservice.AttachmentPointer;

        /**
         * Creates a plain object from an AttachmentPointer message. Also converts values to other types if specified.
         * @param message AttachmentPointer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.AttachmentPointer, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AttachmentPointer to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AttachmentPointer
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace AttachmentPointer {

        /** Flags enum. */
        enum Flags {
            VOICE_MESSAGE = 1,
            BORDERLESS = 2,
            GIF = 8
        }
    }

    /** Properties of a GroupContextV2. */
    interface IGroupContextV2 {

        /** GroupContextV2 masterKey */
        masterKey?: (Uint8Array|null);

        /** GroupContextV2 revision */
        revision?: (number|null);

        /** GroupContextV2 groupChange */
        groupChange?: (Uint8Array|null);
    }

    /** Represents a GroupContextV2. */
    class GroupContextV2 implements IGroupContextV2 {

        /**
         * Constructs a new GroupContextV2.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IGroupContextV2);

        /** GroupContextV2 masterKey. */
        public masterKey: Uint8Array;

        /** GroupContextV2 revision. */
        public revision: number;

        /** GroupContextV2 groupChange. */
        public groupChange: Uint8Array;

        /**
         * Creates a new GroupContextV2 instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GroupContextV2 instance
         */
        public static create(properties?: signalservice.IGroupContextV2): signalservice.GroupContextV2;

        /**
         * Encodes the specified GroupContextV2 message. Does not implicitly {@link signalservice.GroupContextV2.verify|verify} messages.
         * @param message GroupContextV2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IGroupContextV2, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GroupContextV2 message, length delimited. Does not implicitly {@link signalservice.GroupContextV2.verify|verify} messages.
         * @param message GroupContextV2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IGroupContextV2, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GroupContextV2 message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GroupContextV2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.GroupContextV2;

        /**
         * Decodes a GroupContextV2 message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GroupContextV2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.GroupContextV2;

        /**
         * Verifies a GroupContextV2 message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GroupContextV2 message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GroupContextV2
         */
        public static fromObject(object: { [k: string]: any }): signalservice.GroupContextV2;

        /**
         * Creates a plain object from a GroupContextV2 message. Also converts values to other types if specified.
         * @param message GroupContextV2
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.GroupContextV2, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GroupContextV2 to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GroupContextV2
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ContactDetails. */
    interface IContactDetails {

        /** ContactDetails number */
        number?: (string|null);

        /** ContactDetails aci */
        aci?: (string|null);

        /** ContactDetails name */
        name?: (string|null);

        /** ContactDetails avatar */
        avatar?: (signalservice.ContactDetails.IAvatar|null);

        /** ContactDetails expireTimer */
        expireTimer?: (number|null);

        /** ContactDetails inboxPosition */
        inboxPosition?: (number|null);
    }

    /** Represents a ContactDetails. */
    class ContactDetails implements IContactDetails {

        /**
         * Constructs a new ContactDetails.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IContactDetails);

        /** ContactDetails number. */
        public number: string;

        /** ContactDetails aci. */
        public aci: string;

        /** ContactDetails name. */
        public name: string;

        /** ContactDetails avatar. */
        public avatar?: (signalservice.ContactDetails.IAvatar|null);

        /** ContactDetails expireTimer. */
        public expireTimer: number;

        /** ContactDetails inboxPosition. */
        public inboxPosition: number;

        /**
         * Creates a new ContactDetails instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ContactDetails instance
         */
        public static create(properties?: signalservice.IContactDetails): signalservice.ContactDetails;

        /**
         * Encodes the specified ContactDetails message. Does not implicitly {@link signalservice.ContactDetails.verify|verify} messages.
         * @param message ContactDetails message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IContactDetails, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ContactDetails message, length delimited. Does not implicitly {@link signalservice.ContactDetails.verify|verify} messages.
         * @param message ContactDetails message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IContactDetails, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ContactDetails message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContactDetails
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.ContactDetails;

        /**
         * Decodes a ContactDetails message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ContactDetails
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.ContactDetails;

        /**
         * Verifies a ContactDetails message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ContactDetails message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ContactDetails
         */
        public static fromObject(object: { [k: string]: any }): signalservice.ContactDetails;

        /**
         * Creates a plain object from a ContactDetails message. Also converts values to other types if specified.
         * @param message ContactDetails
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.ContactDetails, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ContactDetails to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ContactDetails
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace ContactDetails {

        /** Properties of an Avatar. */
        interface IAvatar {

            /** Avatar contentType */
            contentType?: (string|null);

            /** Avatar length */
            length?: (number|null);
        }

        /** Represents an Avatar. */
        class Avatar implements IAvatar {

            /**
             * Constructs a new Avatar.
             * @param [properties] Properties to set
             */
            constructor(properties?: signalservice.ContactDetails.IAvatar);

            /** Avatar contentType. */
            public contentType: string;

            /** Avatar length. */
            public length: number;

            /**
             * Creates a new Avatar instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Avatar instance
             */
            public static create(properties?: signalservice.ContactDetails.IAvatar): signalservice.ContactDetails.Avatar;

            /**
             * Encodes the specified Avatar message. Does not implicitly {@link signalservice.ContactDetails.Avatar.verify|verify} messages.
             * @param message Avatar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: signalservice.ContactDetails.IAvatar, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Avatar message, length delimited. Does not implicitly {@link signalservice.ContactDetails.Avatar.verify|verify} messages.
             * @param message Avatar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: signalservice.ContactDetails.IAvatar, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Avatar message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Avatar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.ContactDetails.Avatar;

            /**
             * Decodes an Avatar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Avatar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.ContactDetails.Avatar;

            /**
             * Verifies an Avatar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Avatar message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Avatar
             */
            public static fromObject(object: { [k: string]: any }): signalservice.ContactDetails.Avatar;

            /**
             * Creates a plain object from an Avatar message. Also converts values to other types if specified.
             * @param message Avatar
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: signalservice.ContactDetails.Avatar, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Avatar to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Avatar
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }

    /** Properties of a PniSignatureMessage. */
    interface IPniSignatureMessage {

        /** PniSignatureMessage pni */
        pni?: (Uint8Array|null);

        /** PniSignatureMessage signature */
        signature?: (Uint8Array|null);
    }

    /** Represents a PniSignatureMessage. */
    class PniSignatureMessage implements IPniSignatureMessage {

        /**
         * Constructs a new PniSignatureMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IPniSignatureMessage);

        /** PniSignatureMessage pni. */
        public pni: Uint8Array;

        /** PniSignatureMessage signature. */
        public signature: Uint8Array;

        /**
         * Creates a new PniSignatureMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PniSignatureMessage instance
         */
        public static create(properties?: signalservice.IPniSignatureMessage): signalservice.PniSignatureMessage;

        /**
         * Encodes the specified PniSignatureMessage message. Does not implicitly {@link signalservice.PniSignatureMessage.verify|verify} messages.
         * @param message PniSignatureMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IPniSignatureMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PniSignatureMessage message, length delimited. Does not implicitly {@link signalservice.PniSignatureMessage.verify|verify} messages.
         * @param message PniSignatureMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IPniSignatureMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PniSignatureMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PniSignatureMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.PniSignatureMessage;

        /**
         * Decodes a PniSignatureMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PniSignatureMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.PniSignatureMessage;

        /**
         * Verifies a PniSignatureMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PniSignatureMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PniSignatureMessage
         */
        public static fromObject(object: { [k: string]: any }): signalservice.PniSignatureMessage;

        /**
         * Creates a plain object from a PniSignatureMessage message. Also converts values to other types if specified.
         * @param message PniSignatureMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.PniSignatureMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PniSignatureMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PniSignatureMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EditMessage. */
    interface IEditMessage {

        /** EditMessage targetSentTimestamp */
        targetSentTimestamp?: (number|Long|null);

        /** EditMessage dataMessage */
        dataMessage?: (signalservice.IDataMessage|null);
    }

    /** Represents an EditMessage. */
    class EditMessage implements IEditMessage {

        /**
         * Constructs a new EditMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IEditMessage);

        /** EditMessage targetSentTimestamp. */
        public targetSentTimestamp: (number|Long);

        /** EditMessage dataMessage. */
        public dataMessage?: (signalservice.IDataMessage|null);

        /**
         * Creates a new EditMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EditMessage instance
         */
        public static create(properties?: signalservice.IEditMessage): signalservice.EditMessage;

        /**
         * Encodes the specified EditMessage message. Does not implicitly {@link signalservice.EditMessage.verify|verify} messages.
         * @param message EditMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IEditMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EditMessage message, length delimited. Does not implicitly {@link signalservice.EditMessage.verify|verify} messages.
         * @param message EditMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IEditMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EditMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EditMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.EditMessage;

        /**
         * Decodes an EditMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EditMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.EditMessage;

        /**
         * Verifies an EditMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EditMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EditMessage
         */
        public static fromObject(object: { [k: string]: any }): signalservice.EditMessage;

        /**
         * Creates a plain object from an EditMessage message. Also converts values to other types if specified.
         * @param message EditMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.EditMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EditMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for EditMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a WebSocketRequestMessage. */
    interface IWebSocketRequestMessage {

        /** WebSocketRequestMessage verb */
        verb?: (string|null);

        /** WebSocketRequestMessage path */
        path?: (string|null);

        /** WebSocketRequestMessage body */
        body?: (Uint8Array|null);

        /** WebSocketRequestMessage headers */
        headers?: (string[]|null);

        /** WebSocketRequestMessage id */
        id?: (number|Long|null);
    }

    /** Represents a WebSocketRequestMessage. */
    class WebSocketRequestMessage implements IWebSocketRequestMessage {

        /**
         * Constructs a new WebSocketRequestMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IWebSocketRequestMessage);

        /** WebSocketRequestMessage verb. */
        public verb: string;

        /** WebSocketRequestMessage path. */
        public path: string;

        /** WebSocketRequestMessage body. */
        public body: Uint8Array;

        /** WebSocketRequestMessage headers. */
        public headers: string[];

        /** WebSocketRequestMessage id. */
        public id: (number|Long);

        /**
         * Creates a new WebSocketRequestMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WebSocketRequestMessage instance
         */
        public static create(properties?: signalservice.IWebSocketRequestMessage): signalservice.WebSocketRequestMessage;

        /**
         * Encodes the specified WebSocketRequestMessage message. Does not implicitly {@link signalservice.WebSocketRequestMessage.verify|verify} messages.
         * @param message WebSocketRequestMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IWebSocketRequestMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WebSocketRequestMessage message, length delimited. Does not implicitly {@link signalservice.WebSocketRequestMessage.verify|verify} messages.
         * @param message WebSocketRequestMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IWebSocketRequestMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WebSocketRequestMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WebSocketRequestMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.WebSocketRequestMessage;

        /**
         * Decodes a WebSocketRequestMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WebSocketRequestMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.WebSocketRequestMessage;

        /**
         * Verifies a WebSocketRequestMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WebSocketRequestMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WebSocketRequestMessage
         */
        public static fromObject(object: { [k: string]: any }): signalservice.WebSocketRequestMessage;

        /**
         * Creates a plain object from a WebSocketRequestMessage message. Also converts values to other types if specified.
         * @param message WebSocketRequestMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.WebSocketRequestMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WebSocketRequestMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for WebSocketRequestMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a WebSocketResponseMessage. */
    interface IWebSocketResponseMessage {

        /** WebSocketResponseMessage id */
        id?: (number|Long|null);

        /** WebSocketResponseMessage status */
        status?: (number|null);

        /** WebSocketResponseMessage message */
        message?: (string|null);

        /** WebSocketResponseMessage headers */
        headers?: (string[]|null);

        /** WebSocketResponseMessage body */
        body?: (Uint8Array|null);
    }

    /** Represents a WebSocketResponseMessage. */
    class WebSocketResponseMessage implements IWebSocketResponseMessage {

        /**
         * Constructs a new WebSocketResponseMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IWebSocketResponseMessage);

        /** WebSocketResponseMessage id. */
        public id: (number|Long);

        /** WebSocketResponseMessage status. */
        public status: number;

        /** WebSocketResponseMessage message. */
        public message: string;

        /** WebSocketResponseMessage headers. */
        public headers: string[];

        /** WebSocketResponseMessage body. */
        public body: Uint8Array;

        /**
         * Creates a new WebSocketResponseMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WebSocketResponseMessage instance
         */
        public static create(properties?: signalservice.IWebSocketResponseMessage): signalservice.WebSocketResponseMessage;

        /**
         * Encodes the specified WebSocketResponseMessage message. Does not implicitly {@link signalservice.WebSocketResponseMessage.verify|verify} messages.
         * @param message WebSocketResponseMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IWebSocketResponseMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WebSocketResponseMessage message, length delimited. Does not implicitly {@link signalservice.WebSocketResponseMessage.verify|verify} messages.
         * @param message WebSocketResponseMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IWebSocketResponseMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WebSocketResponseMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WebSocketResponseMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.WebSocketResponseMessage;

        /**
         * Decodes a WebSocketResponseMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WebSocketResponseMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.WebSocketResponseMessage;

        /**
         * Verifies a WebSocketResponseMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WebSocketResponseMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WebSocketResponseMessage
         */
        public static fromObject(object: { [k: string]: any }): signalservice.WebSocketResponseMessage;

        /**
         * Creates a plain object from a WebSocketResponseMessage message. Also converts values to other types if specified.
         * @param message WebSocketResponseMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.WebSocketResponseMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WebSocketResponseMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for WebSocketResponseMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a WebSocketMessage. */
    interface IWebSocketMessage {

        /** WebSocketMessage type */
        type?: (signalservice.WebSocketMessage.Type|null);

        /** WebSocketMessage request */
        request?: (signalservice.IWebSocketRequestMessage|null);

        /** WebSocketMessage response */
        response?: (signalservice.IWebSocketResponseMessage|null);
    }

    /** Represents a WebSocketMessage. */
    class WebSocketMessage implements IWebSocketMessage {

        /**
         * Constructs a new WebSocketMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: signalservice.IWebSocketMessage);

        /** WebSocketMessage type. */
        public type: signalservice.WebSocketMessage.Type;

        /** WebSocketMessage request. */
        public request?: (signalservice.IWebSocketRequestMessage|null);

        /** WebSocketMessage response. */
        public response?: (signalservice.IWebSocketResponseMessage|null);

        /**
         * Creates a new WebSocketMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WebSocketMessage instance
         */
        public static create(properties?: signalservice.IWebSocketMessage): signalservice.WebSocketMessage;

        /**
         * Encodes the specified WebSocketMessage message. Does not implicitly {@link signalservice.WebSocketMessage.verify|verify} messages.
         * @param message WebSocketMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: signalservice.IWebSocketMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WebSocketMessage message, length delimited. Does not implicitly {@link signalservice.WebSocketMessage.verify|verify} messages.
         * @param message WebSocketMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: signalservice.IWebSocketMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WebSocketMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WebSocketMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): signalservice.WebSocketMessage;

        /**
         * Decodes a WebSocketMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WebSocketMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): signalservice.WebSocketMessage;

        /**
         * Verifies a WebSocketMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WebSocketMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WebSocketMessage
         */
        public static fromObject(object: { [k: string]: any }): signalservice.WebSocketMessage;

        /**
         * Creates a plain object from a WebSocketMessage message. Also converts values to other types if specified.
         * @param message WebSocketMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: signalservice.WebSocketMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WebSocketMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for WebSocketMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace WebSocketMessage {

        /** Type enum. */
        enum Type {
            UNKNOWN = 0,
            REQUEST = 1,
            RESPONSE = 2
        }
    }
}
