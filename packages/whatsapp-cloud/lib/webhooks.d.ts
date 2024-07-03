import type { Logger } from '@chatally/logger'
import type { Express } from 'express-serve-static-core'
import type { EventEmitter } from 'node:events'

/**
 * WhatsApp Webhooks Server Class
 */
export declare class Webhooks extends EventEmitter<WebhooksEvents> {
  log: Logger | undefined

  /**
   * Create a WhatsApp Webhooks server.
   *
   * The server implements EventEmitter, you can register the event
   * `notification`, it gives you notification with incoming messages,
   * statuses, and errors.
   *
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks
   *
   * @param config
   */
  constructor (config?: WebhooksConfig)

  /**
   * Start the server
   * @param port [Optional] Port to listen on [`default=3000`]
   */
  listen (port?: number): void

  /**
   * Get the underlying express app (for testing purposes).
   *
   * @protected
   */
  get _app (): Express
}

interface WebhooksEvents {
  notification: WebhooksNotification[]
}

export interface WebhooksNotification {
  messages: IncomingMessage[]
  statuses: Status[]
  errors: Error[]
}

export interface WebhooksConfig {
  /**
   * [Optional] token to verify webhooks registration, if not provided webhooks
   * cannot be registered with WhatsApp business account
   * [`default=undefined`]
   */
  verifyToken?: string | undefined

  /**
   * [Optional] secret to verify payload signatures, if not provided thet
   * payload is not verified
   * [`default=undefined`]
   */
  secret?: string

  /**
   * [Optional] URL path to listen on
   * [`default="/"`]
   */
  path?: string

  /**
   * [Optional] Port to listen on
   * [`default=3000`]
   */
  port?: number

  /**
   * [Optional] Logger to use instead of console
   * [`default=undefined`]
   */
  log?: Logger
}

/**
 * Notification Payload Object
 *
 * The notification payload is a combination of nested objects of JSON arrays
 * and objects that contain information about a change.
 */
export interface Notification {
  /**
   * The specific webhook a business is subscribed to.
   *
   * The webhook is `whatsapp_business_account`.
   */
  object: 'whatsapp_business_account'
  /** An array of entry objects. */
  entry: Entry[]
}

export interface Entry {
  /**
   * The WhatsApp Business Account ID for the business that is subscribed to
   * the webhook.
   */
  id: string
  /** An array of change objects. */
  changes: Change[]
}

export interface Change {
  /** Notification type. Value will be `messages`. */
  field: 'messages'
  value: Value
}

/**
 * Value Object
 *
 * The value object contains details for the change that triggered the webhook.
 */
export interface Value {
  /** Product used to send the message. Value is always `whatsapp`. */
  messaging_product: 'whatsapp'
  /**
   * Array of contact objects
   *
   * Contains information for the customer who sent a message to the business.
   */
  contacts?: Contact[]
  /** An array of error objects describing the error. */
  errors?: Error[]
  /** Information about a message received. */
  messages?: IncomingMessage[]
  /** A metadata object describing the business subscribed to the webhook. */
  metadata: Metadata[]
  /** Status object for a message that was sent. */
  statuses?: Status[]
}

export interface Contact {
  /**
   * The customer's WhatsApp ID.
   *
   * A business can respond to a message using this ID.
   */
  wa_id: string
  /** A customer profile object. */
  profile: Profile
}

export interface Profile {
  /** The customer's name. */
  name: string
}

export interface Error {
  /**
   * Error code.
   *
   * We recommend that you build your app's error handling around error codes
   * instead of subcodes or HTTP response status codes.
   *
   * For details see https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes#error-codes
   */
  code: number
  /** Error code title. Example: Rate limit hit. */
  title: string
  /** Error code message. This value is the same as the title value. */
  message: string
  /** An error data object */
  error_data: ErrorDataObject
}

export interface ErrorDataObject {
  /** Describes the error. Example: Message failed to send */
  details: string
}

/**
 * Incoming message.
 *
 * The data structures of incoming messages are similar to the data structures
 * of outgoing messages, but they are not identical, hence the need for
 * separate types.
 */
export type IncomingMessage = {
  /**
   * Context object.
   *
   * Only included when a user replies or interacts with one of your messages.
   */
  context?: Context

  /** An array of error objects describing the error. */
  errors: Error[]

  /** The customer's phone number who sent the message to the business. */
  from: string

  /**
   * The ID (WAMID) for the message that was received.
   *
   * You could use messages endpoint to mark this specific message as read.
   */
  id: string

  /** Unix timestamp.
   *
   * indicating when the WhatsApp server received the message from the
   * customer. */
  timestamp: string

  /**
   * An identity object.
   *
   * Webhook is triggered when a customer's phone number or profile
   * information has been updated. See `messages system identity`.
   */
  identity?: Identity
} & (
  | IncomingAudio
  | IncomingButton
  | IncomingDocument
  | IncomingImage
  | IncomingInteractive
  | IncomingLocation
  | IncomingOrder
  | IncomingReaction
  | IncomingReferral
  | IncomingSticker
  | IncomingText
  | IncomingVideo
  | SystemMessage
)

export interface Context {
  /** Set to true if the message received has been forwarded. */
  forwarded: boolean

  /**
   * Set to true if the message received has been forwarded
   * more than 5 times.
   */
  frequently_forwarded: boolean

  /** The WhatsApp ID for the customer who replied to an inbound message. */
  from: string

  /** The message ID for the sent message for an inbound reply. */
  id: string

  /**
   * Referred product object describing the product the user is requesting
   * information about.
   *
   * You must parse this value if you support Product Enquiry Messages.
   * See [Receive Response From Customers](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/sell-products-and-services/receive-responses).
   */
  referred_product: {
    /** Unique identifier of the linked Meta catalog. */
    catalog_id: string
    /** Unique identifier of the product in a catalog. */
    product_retailer_id: string
  }
}

export interface Identity {
  /**
   * State of acknowledgment for the messages system
   * `customer_identity_changed`.
   */
  acknowledged: string

  /**
   * The time when the WhatsApp Business Management API detected the customer
   * may have changed their profile information.
   */
  created_timestamp: string

  /**
   * The ID for the messages system `customer_identity_changed`
   */
  hash: string
}

export interface IncomingAudio {
  /** Includes voice messages */
  type: 'audio'
  audio: {
    /** ID for the audio file. */
    id: string
    /** Mime type of the audio file. */
    mime_type: AudioMimeType
  }
}

export type AudioMimeType =
  | 'audio/aac'
  | 'audio/mp4'
  | 'audio/mpeg'
  | 'audio/amr'
  | 'audio/ogg'

/**
 * This message can only result from a message template.
 * All other buttons are received as InteractiveMessage.
 */
export interface IncomingButton {
  type: 'button'
  button: {
    /** The payload of the button. */
    payload: string
    /** The text of the button. */
    text: string
  }
}

export interface IncomingDocument {
  type: 'document'
  document: {
    /** Caption for the document, if provided. */
    caption?: string
    /** Name for the file on the sender's device. */
    filename: string
    /** SHA 256 hash. */
    sha256: string
    /** Mime type of the document file. */
    mime_type: DocumentMimeType
    /** ID for the document. */
    id: string
  }
}

export type DocumentMimeType =
  | 'text/plain'
  | 'application/pdf'
  | 'application/vnd.ms-powerpoint'
  | 'application/msword'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export interface IncomingImage {
  type: 'image'
  image: {
    /** Caption for the image, if provided. */
    caption?: string
    /** SHA 256 hash. */
    sha256: string
    /** Mime type of the image file. */
    mime_type: ImageMimeType
    /** ID for the image. */
    id: string
  }
}

export type ImageMimeType = 'image/jpeg' | 'image/png'

export interface IncomingInteractive {
  type: 'interactive'
  /** When a customer has interacted with your message. */
  interactive:
  | {
    type: 'button_reply'
    /** Sent when a customer clicks a button. */
    button_reply: {
      /** Unique ID of a button. */
      id: string
      /** Title of a button. */
      title: string
    }
  }
  | {
    type: 'list_reply'
    /** Sent when a customer selects an item from a list. */
    list_reply: {
      /** Unique ID of the selected list item. */
      id: string
      /** Title of the selected list item. */
      title: string
      /** Description of the selected row. */
      description?: string
    }
  }
}

export interface IncomingLocation {
  type: 'location'
  location: {
    /** Longitude of the location. */
    longitude: number
    /** Latitude of the location. */
    latitude: number
    /** Name of the location. */
    name?: string
    /** Address of the location. Only displayed if name is present. */
    address?: string
  }
}

export interface IncomingOrder {
  type: 'order'
  /** Included in the messages object when a customer has placed an order. */
  order: {
    /** ID for the catalog the ordered item belongs to. */
    catalog_id: string
    /** Text message from the user sent along with the order. */
    text: string
    /** Array of product item objects */
    product_items: ProductItem[]
  }
}

export interface ProductItem {
  /** Unique identifier of the product in a catalog. */
  product_retailer_id: string
  /** Number of items. */
  quantity: string
  /** Price of each item. */
  item_price: string
  /** Price currency. */
  currency: string
}

export interface IncomingReaction {
  type: 'reaction'
  reaction: {
    /** The ID of the message the customer reacted to. */
    message_id: string
    /** The emoji the customer reacted with. */
    emoji: string
  }
}

export interface IncomingReferral {
  type: 'referral'
  /** Referral object. When a customer clicks an ad redirecting to WhatsApp. */
  referral: {
    /**
     * The Meta URL that leads to the ad or post clicked by the customer.
     * Opening this url takes you to the ad viewed by your customer.
     */
    source_url: URL
    /** The type of the ad's source; ad or post. */
    source_type: 'ad' | 'post'
    /** Meta ID for an ad or a post. */
    source_id: string
    /** Headline used in the ad or post. */
    headline: string
    /** Body for the ad or post. */
    body: string
    /** Media present in the ad or post; image or video. */
    media_type: ImageMimeType | VideoMimeType
    /** URL of the image, when media_type is an image. */
    image_url: URL
    /** URL of the video, when media_type is a video. */
    video_url: URL
    /** URL for the thumbnail, when media_type is a video. */
    thumbnail_url: URL
  }
}

export interface IncomingSticker {
  type: 'sticker'
  sticker: {
    /** image/webp. */
    mime_type: 'image/webp'
    /** Hash for the sticker. */
    sha256: string
    /** ID for the sticker. */
    id: string
    /** Set to true if the sticker is animated; false otherwise. */
    animated: boolean
  }
}

export interface IncomingText {
  type: 'text'
  text: {
    /** The text of the message. */
    body: string
  }
}

export interface IncomingVideo {
  type: 'video'
  video: {
    /** The caption for the video, if provided. */
    caption?: string
    /** The name for the file on the sender's device. */
    filename: string
    /** The hash for the video. */
    sha256: string
    /** The ID for the video. */
    id: string
    /** The mime type for the video file. */
    mime_type: VideoMimeType
  }
}

export type VideoMimeType = 'video/mp4' | 'video/3gp'

export interface Metadata {
  /** The phone number that is displayed for a business. */
  display_phone_number: string
  /** ID for the phone number.
   *
   * A business can respond to a message using this ID.
   */
  phoneNumberId: string
}

/**
 * Statuses Object
 *
 * The statuses object is nested within the value object and is triggered when
 * a message is sent or delivered to a customer or the customer reads the
 * delivered message sent by a business that is subscribed to the Webhooks.
 *
 * For details see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components#statuses-object
 */
export interface Status {
  /** Information about the conversation. */
  conversation: Conversation
  /** An array of error objects describing the error. */
  errors?: Error[]
  /** The ID for the message that the business sent to a customer */
  id: string
  /** An object containing billing information. */
  pricing: Pricing
  /** The WhatsApp ID for the customer */
  recipient_id: string
  status: StatusType
  /** Date for the status message */
  timestamp: string
}

export interface Conversation {
  /**
   * Represents the ID of the conversation the given status notification
   * belongs to.
   */
  id: string

  /** Indicates who initiated the conversation */
  origin: {
    /**
     * Indicates where a conversation has started.
     *
     * This can also be referred to as a conversation entry point
     */
    type: ConversationType
  }

  /**
   * Date when the conversation expires.
   *
   * This field is only present for messages with a `status` set to `sent`.
   */
  expiration_timestamp: string
}

export type ConversationType =
  | 'business_initiated'
  | 'customer_initiated'
  | 'referral_conversion'
  | 'user_initiated'

export interface Pricing {
  /** Indicates whether the conversation is billable */
  billable: boolean
  /** Indicates the conversation pricing category */
  category: ConversationType
  /**
   * Type of pricing model used.
   *
   * Current supported value is CBP
   */
  pricing_model: 'CBP'
}

export type StatusType = 'delivered' | 'failed' | 'read' | 'sent'

export interface SystemMessage {
  type: 'system'
  /** Customer has updated their phone number or profile information */
  system: {
    /** Describes the change to the customer's identity or phone number. */
    body: string
    /** Hash for the identity fetched from server. */
    identity: string
    /** New WhatsApp ID for the customer when their phone number is updated. */
    wa_id: string
    /** Type of system update. */
    type:
    | 'customer_changed_number' // changed phone number
    | 'customer_identity_changed' // changed profile information
    /** The WhatsApp ID for the customer prior to the update. */
    customer: string
  }
}
