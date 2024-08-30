import type { Logger } from '@chatally/logger'
import type { GraphApi } from './graph-api.d.ts'
import type { Webhooks } from './webhooks.d.ts'

export declare class Messages {
  log: Logger | undefined

  /**
   * Map of waiting messages.
   *
   * The map contains a queue per recipient_id. Each queue starts with the
   * previous message being sent, until we receive a status that it has been
   * delivered.
   *
   * Published only for tests or subclasses.
   * @protected
   */
  _queues: Record<string, Waiting[]>

  /**
   * Send WhatsApp messages using the Graph API. Abstracts the
   * `https://graph.facebook.com/<version>/PHONE_NUMBER_ID/messages` endpoint.
   *
   * Use it to send text, media, contacts, location, and interactive messages,
   * as well as message templates through WhatsApp. You can also mark incoming
   * messages as `read` through the Messages endpoint.
   *
   * [Learn more about the messages you can send](https://developers.facebook.com/docs/whatsapp/conversation-types).
   *
   * Messages are sent asynchronously. The API returns a 200 OK response with
   * the message's unique ID (WAMID) when the message is successfully queued for
   * delivery. The API does not return a response when the message is delivered.
   * There is no guarantee about the order of delivery, even when awaiting the
   * method call.
   */
  constructor(config: MessagesConfig)

  /**
   * Wait for `delivered` status of previous message before sending the next.
   * This requires notifications from the Webhooks API.
   *
   * @param webhooks Webhooks API
   * @returns this
   */
  sequential?: (webhooks: Webhooks) => this

  /**
   * Wrapper around the Graph API request to send a message.
   *
   * It automatically sets the `messaging_product` and `recipient_type` fields,
   * as well as the correct headers. For full type-safety use the respective
   * send<Type> methods instead.
   *
   * @param to recipient phone number
   * @param message payload corresponding to the message type
   * @param replyTo [Optional] message id to reply to
   * @returns the message id from the WhatsApp server (WAMID)
   */
  send(to: string, message: Message, replyTo?: string): Promise<string>

  /**
   * Mark a message as read.
   *
   * Send a POST request to the `/PHONE_NUMBER_ID/messages` endpoint with
   * messaging_product set to whatsapp, message_id set to the message ID and
   * status to read.
   *
   * For details, see
   * https://developers.facebook.com/docs/whatsapp/cloud-api/guides/mark-message-as-read
   *
   * @param wamid The WAMID of the message to mark as read.
   * @returns true, if the message was marked as read, false otherwise.
   */
  markAsRead(wamid: string): Promise<boolean>
}

export interface Waiting {
  to: string
  message: Message
  replyTo?: string
}

export interface MessagesConfig {
  /**
   * Access to Meta's Graph API
   */
  graphApi: GraphApi

  /**
   * Flag, whether messages shall be delivered sequentially, i.e. the next
   * message to the same recipient will only be delivered, after a status has
   * been received for the previous message.
   *
   * If you provide a number, the message will be considered delivered after
   * that amount of seconds.
   *
   * This overrides the call to the method `sequential`.
   */
  sequential?: false | number

  /**
   * [Optional] logger to use
   * [default=undefined]
   */
  log?: Logger
}

export type Message = {
  id?: string
  waitingSince?: number
} & (
    | AudioMessage
    | ContactsMessage
    | DocumentMessage
    | ImageMessage
    | InteractiveMessage
    | LocationMessage
    | ReactionMessage
    | StickerMessage
    | TemplateMessage
    | TextMessage
    | VideoMessage
  )

/**
 * Response from the Graph API when sending a message.
 *
 * https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#successful-response
 */
export interface MessagesResponse {
  messaging_product: 'whatsapp'
  contacts?: Array<{
    input: string
    wa_id: string
  }>
  messages: Array<{
    id: string
  }>
}

/**
 * Contact content.
 *
 * https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#contacts-object
 */
export interface Contact {
  /** Full contact address(es) formatted as an addresses object. */
  addresses?: Addresses[]
  /** YYYY-MM-DD formatted string. */
  birthday?: Birthday
  /** Contact email address(es) formatted as an emails object. */
  emails?: Email[]
  /** Full contact name formatted as a name object. */
  name: Name
  /** Contact organization information formatted as an org object. */
  org?: Org
  /** Contact phone number(s) formatted as a phone object. */
  phones?: Phone[]
  /** Contact URL(s) formatted as a urls object. */
  urls?: URL[]
}

export interface ContactsMessage {
  type: 'contacts'
  contacts: Contact[]
}

interface Addresses {
  /** Street number and name. */
  street?: string
  /** City name. */
  city?: string
  /** State abbreviation. */
  state?: string
  /** ZIP code. */
  zip?: string
  /** Full country name. */
  country?: string
  /** Two-letter country abbreviation. */
  country_code?: string
  /** Standard values are HOME and WORK. */
  type?: 'HOME' | 'WORK' | string
}

type Birthday =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`

interface Email {
  /** Email address. */
  email?: string
  /** Standard values are HOME and WORK. */
  type?: 'HOME' | 'WORK' | string
}

interface Name {
  /** Full name, as it normally appears. */
  formatted_name: string
  /** First name. */
  first_name?: string
  /** Last name. */
  last_name?: string
  /** Middle name. */
  middle_name?: string
  /** Name suffix. */
  suffix?: string
  /** Name prefix. */
  prefix?: string
}

interface Org {
  /** Name of the contact's company. */
  company?: string
  /** Name of the contact's department. */
  department?: string
  /** Contact's business title. */
  title?: string
}

interface Phone {
  /** Automatically populated with the `wa_id` value as a formatted phone number. */
  phone?: string
  /** Standard Values are CELL, MAIN, IPHONE, HOME, and WORK. */
  type?: 'CELL' | 'MAIN' | 'IPHONE' | 'HOME' | 'WORK' | string
  /** WhatsApp ID. */
  wa_id?: string
}

interface URL {
  /** URL. */
  url?: string
  /** Standard values are HOME and WORK. */
  type?: 'HOME' | 'WORK' | string
}

export type Interactive =
  | InteractiveButton
  | InteractiveList
  | InteractiveProduct
  | InteractiveProductList

export interface InteractiveMessage {
  type: 'interactive'
  interactive: Interactive
}

/**
 * Reply Button.
 */
export interface InteractiveButton {
  /** The interface of interactive message you want to send. */
  type: 'button'
  /** Header content displayed on top of a message. */
  header?: Header
  /** An object with the footer of the message. */
  footer?: Footer
  /** An object with the body of the message. */
  body: Body
  /** */
  action: {
    /** You can have up to 3 buttons. */
    buttons: ReplyButton[]
  }
}

export interface ReplyButton {
  /** only supported interface is reply */
  type: 'reply'
  reply: {
    /**
     * Unique identifier for your button.
     *
     * This ID is returned in the webhook when the button is clicked by the
     * user. It cannot have leading or trailing spaces.
     *
     * Maximum length: 256 characters.
     */
    id: string
    /**
     * Button title.
     *
     * It cannot be an empty string and must be unique within the message.
     * Emojis are supported, markdown is not.
     *
     * Maximum length: 20 characters.
     */
    title: string
  }
}

/**
 * List Message.
 */
export interface InteractiveList {
  /** The interface of interactive message you want to send. */
  type: 'list'
  /** Header content displayed on top of a message. */
  header?: Header
  /** An object with the footer of the message. */
  footer?: Footer
  /** An object with the body of the message. */
  body: Body
  /** */
  action: {
    /**
     * Button content.
     *
     * It cannot be an empty string and must be unique within the message.
     * Emojis are supported, markdown is not.
     *
     * Maximum length: 20 characters.
     */
    button: string
    /** Array of section objects. Minimum of 1, maximum of 10. */
    sections: ListSection[]
  }
}

export interface ListSection {
  /** List of rows. You can have a total of 10 rows across your sections. */
  rows: Row[]
  /**
   * Title of the section.
   *
   * Required if the message has more than one section.
   * Maximum length: 24 characters.
   */
  title?: string
}

export interface Row {
  /** ID (Maximum length: 200 characters) */
  id: string
  /** Title (Maximum length: 24 characters) */
  title: string
  /** Description (Maximum length: 72 characters) */
  description?: string
}

export interface CreateInteractiveListParams {
  header?: Header | string
  footer?: string
  body: string
  button: string
}

/**
 * Single Product Message.
 */
export interface InteractiveProduct {
  /** The interface of interactive message you want to send. */
  type: 'product'
  /** An object with the footer of the message. */
  footer?: Footer
  /** An object with the body of the message. */
  body?: Body
  /** */
  action: {
    /**
     * Unique identifier of the Facebook catalog linked to your WABA.
     *
     * This ID can be retrieved via the [Meta Commerce Manager](https://business.facebook.com/commerce_manager/get_started/).
     */
    catalog_id: string
    /** Unique identifier of the product in a catalog. */
    product_retailer_id: string
  }
}

/**
 * Multi-Product Message.
 */
export interface InteractiveProductList {
  /** The interface of interactive message you want to send. */
  type: 'product_list'
  /** Header content displayed on top of a message. */
  header: Header
  /** An object with the footer of the message. */
  footer?: Footer
  /** An object with the body of the message. */
  body: Body
  /** */
  action: {
    /**
     * Unique identifier of the Facebook catalog linked to your WABA.
     *
     * This ID can be retrieved via the [Meta Commerce Manager](https://business.facebook.com/commerce_manager/get_started/).
     */
    catalog_id: string
    /** Array of section objects. Minimum of 1, maximum of 10. */
    sections: ProductListSection[]
  }
}

export interface ProductListSection {
  product_items: Array<{
    /**
     * Unique identifier of the product in a catalog.
     *
     * To get this ID, go to the Meta Commerce Manager, select your account and
     * the shop you want to use. Then, click Catalog > Items, and find the item
     * you want to mention. The ID for that item is displayed under the item's
     * name.
     */
    product_retailer_id: string
  }>
  /**
   * Title of the section.
   *
   * Required if the message has more than one section.
   * Maximum length: 24 characters.
   */
  title?: string
}

type Header = DocumentHeader | ImageHeader | TextHeader | VideoHeader

export interface DocumentHeader {
  type: 'document'
  /**
   * Contains the media object for this document.
   */
  document: Document
}

export interface ImageHeader {
  type: 'image'
  /**
   * Contains the media object for this image.
   */
  image: Image
}

export interface TextHeader {
  type: 'text'
  /**
   * Text for the header.
   *
   * Emojis, markdown, and links are supported.
   * Maximum length: 60 characters.
   */
  text: string
}

export interface VideoHeader {
  type: 'video'
  /**
   * Contains the media object for this video.
   */
  video: Video
}

export interface Footer {
  /**
   * The footer content.
   *
   * Emojis, markdown, and links are supported. Maximum length: 60 characters.
   */
  text: string
}

export interface Body {
  /**
   * The content of the message.
   *
   * Emojis and markdown are supported. Maximum length: 1024 characters.
   */
  text: string
}

/**
 * Location Object.
 *
 * https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#location-object
 */
export interface Location {
  /** Longitude of the location. */
  longitude: number
  /** Latitude of the location. */
  latitude: number
  /** Name of the location. */
  name?: string
  /** Address of the location. Only displayed if name is present. */
  address?: string
}

export interface LocationMessage {
  type: 'location'
  location: Location
}

/**
 * Media Object
 *
 * See [Get Media ID](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#get-media-id)
 * for information on how to get the ID of your media object. For information
 * about supported media types for Cloud API, see
 * [Supported Media Types](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#supported-media-types).
 *
 * For details see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#media-object
 */
export type MediaObject = UploadedMedia | LinkedMedia

/**
 * Uploaded media asset.
 */
export interface UploadedMedia {
  /** The media object ID. */
  id: string
  /** Use id instead for uploaded media. */
  link?: never
}

/**
 * Linked media asset.
 *
 * See [Media HTTP Caching](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#media-http-caching)
 * if you would like us to cache the media asset for future messages.
 *
 * When we request the media asset from your server you must indicate the
 * media's MIME type by including the Content-Type HTTP header. For example:
 * Content-Type: video/mp4. See Supported Media Types for a list of supported
 * media and their MIME types.
 */
export interface LinkedMedia {
  /** Use link instead for linked media. */
  id?: never
  /** The protocol and URL of the media to be sent. */
  link: string
}

/**
 * Audio content.
 *
 * Supported audio formats are:
 *   - audio/aac,
 *   - audio/mp4,
 *   - audio/mpeg,
 *   - audio/amr,
 *   - audio/ogg (only opus codecs, base audio/ogg is not supported).
 * Size limit is 16MB.
 *
 * https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#supported-media-types
 */
export type Audio = MediaObject

export interface AudioMessage {
  type: 'audio'
  audio: Audio
}

/**
 * Document content.
 *
 * Supported document formats are:
 *   - text/plain,
 *   - application/pdf,
 *   - application/vnd.ms-powerpoint,
 *   - application/msword,
 *   - application/vnd.ms-excel,
 *   - application/vnd.openxmlformats-officedocument.wordprocessingml.document,
 *   - application/vnd.openxmlformats-officedocument.presentationml.presentation,
 *   - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.
 *
 * Only PDF documents are supported for media-based message templates.
 * Size limit is 100MB.
 */
export type Document = MediaObject & {
  caption?: string
  /** Describes the filename for the specific document. */
  filename?: string
}

export interface DocumentMessage {
  type: 'document'
  document: Document
}

/**
 * Image content.
 *
 * Supported image formats are:
 *  - image/jpeg,
 *  - image/png
 *
 * Size limit is 5MB.
 */
export type Image = MediaObject & {
  caption?: string
}

export interface ImageMessage {
  type: 'image'
  image: Image
}

/**
 * Sticker content.
 *
 * Supported sticker formats are: image/webp.
 *
 * Size limit for static stickers is 100KB, for animated stickers is 500KB.
 */
export type Sticker = MediaObject

export interface StickerMessage {
  type: 'sticker'
  sticker: Sticker
}

/**
 * Video content.
 *
 * Supported video formats are:
 *  - video/mp4,
 *  - video/3gp
 *
 * Notes:
 *   - Only H.264 video codec and AAC audio codec is supported.
 *   - Only videos with a single audio stream or no audio stream are supported.
 *
 * Size limit is 16MB.
 */
export type Video = MediaObject & {
  caption?: string
}

export interface VideoMessage {
  type: 'video'
  video: Video
}

export interface Reaction {
  /** The ID of the message the customer reacted to. */
  message_id: string
  /** The emoji the customer reacted with. */
  emoji: string
}

export interface ReactionMessage {
  type: 'reaction'
  reaction: Reaction
}

/**
 * Template content.
 *
 * For details see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#template-object
 */
export interface Template {
  /** Name of the template. */
  name: string
  /** Specifies the language the template may be rendered in. */
  language: {
    /**
     * The language policy the message should follow.
     *
     * The only supported option is `deterministic`.
     * For details see https://developers.facebook.com/docs/whatsapp/api/messages/message-templates#language-policy-options
     */
    policy: 'deterministic'
    /**
     * The code of the language or locale to use.
     */
    code: string
  }
  /**  */
  components?: Component[]
}

export interface TemplateMessage {
  type: 'template'
  template: Template
}

type Component = HeaderComponent | BodyComponent | ButtonComponent

interface HeaderComponent {
  type: 'header'
}

interface BodyComponent {
  type: 'body'
  parameters: Parameter[]
}

type Parameter =
  | CurrencyParameter
  | DateTimeParameter
  | DocumentParameter
  | ImageParameter
  | TextParameter
  | VideoParameter

interface CurrencyParameter {
  /** Describes the parameter type. */
  type: 'currency'
  /** A currency object. */
  currency: Currency
}

interface Currency {
  /** Default text if localization fails. */
  fallback_value: string
  /** Currency code as defined in ISO 4217. */
  code: string
  /** Amount multiplied by 1000. */
  amount_1000: number
}

interface DateTimeParameter {
  /** Describes the parameter type. */
  type: 'date_time'
  /** A date_time object. */
  date_time: {
    /**
     * Default text.
     *
     * We always use the fallback value, and we do not attempt to localize
     * using other optional fields.
     */
    fallback_value: string
  }
}

interface DocumentParameter {
  /** Describes the parameter type. */
  type: 'document'
  /**
   * A media object of type document.
   *
   * Only PDF documents are supported for media-based message templates.
   * Captions not supported when used in a media template.
   */
  document: Document
}

interface ImageParameter {
  /** Describes the parameter type. */
  type: 'image'
  /**
   * A media object of type image.
   *
   * Captions not supported when used in a media template.
   */
  image: Image
}

interface TextParameter {
  /** Describes the parameter type. */
  type: 'text'
  /**
   * The message’s text.
   *
   * Character limit varies based on the following included component type.
   *
   * For the header component type:
   * -  60 characters
   *
   * For the body component type:
   *   - 1024 characters if other component types are included
   *   - 32768 characters if body is the only component type included
   */
  text: string
}

interface VideoParameter {
  /** Describes the parameter type. */
  type: 'video'
  /**
   * A media object of type video.
   *
   * Captions not supported when used in a media template.
   */
  video: Video
}

interface ButtonComponent {
  type: 'button'
  /**
   * Type of button to create.
   *
   * - `quick_reply`: Refers to a previously created quick reply button that
   *   allows for the customer to return a predefined message.
   * - `url`: Refers to a previously created button that allows the customer to
   *   visit the URL generated by appending the text parameter to the
   *   predefined prefix URL in the template.
   */
  sub_type: 'quick_reply' | 'url'

  /**
   * Array of parameter objects with the content of the message.
   *
   * For components of type=button, see the button parameter object.
   */
  parameters: ButtonParameter[]
  /**
   * Position index of the button.
   *
   * You can have up to 3 buttons using index values of 0 to 2.
   */
  index: number
}

type ButtonParameter = PayloadButtonParameter | TextButtonParameter

interface PayloadButtonParameter {
  type: 'payload'
  /**
   * Developer-defined payload.
   *
   * Will be returned when the button is clicked in addition to the display
   * text on the button.
   */
  payload: string
}

interface TextButtonParameter {
  type: 'text'
  /**
   * Developer-provided suffix.
   *
   * Will be appended to the predefined prefix URL in the template.
   */
  text: string
}

/**
 * Text Object.
 */
export interface Text {
  /**
   * The text of the text message.
   *
   * It can contain URLs which begin with http:// or https:// and formatting.
   * See available formatting options [here](https://developers.facebook.com/docs/whatsapp/on-premises/reference/messages#formatting).
   */
  body: string

  /**
   * Render a link preview of any URL in the body text string.
   *
   * URLs must begin with http:// or https://. If multiple URLs are in the body
   * text string, only the first URL will be rendered.
   *
   * If preview_url is omitted, or if unable to retrieve a preview, a clickable
   * link will be rendered instead.
   */
  preview_url?: boolean
}

export interface TextMessage {
  type: 'text'
  text: Text
}
