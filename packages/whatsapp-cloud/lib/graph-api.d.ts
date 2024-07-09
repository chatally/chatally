import type { Logger } from '@chatally/logger'
import { BaseError } from './errors.js'

export declare class GraphApi {
  log?: Logger

  protected _request: RequestFn

  constructor(config: GraphApiConfig)

  post(
    endpoint: string,
    body: string | FormData | Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<GraphApiResult>

  get(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<GraphApiResult>

  delete(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<GraphApiResult>
}

export declare class GraphApiMock extends GraphApi { }

export interface GraphApiConfig {
  /**
   * Sender id, i.e. the phone number id of the WhatsApp business account
   */
  phoneNumberId: string

  /**
   * Access token to use as authorization bearer
   */
  accessToken: string

  /**
   * [Optional] Base URL for Meta GraphAPI
   *
   * [default="graph.facebook.com"]
   */
  baseUrl?: string

  /**
   * [Optional] Port at which to reach Meta GraphAPI
   *
   * [default=undefined]
   */
  basePort?: number

  /**
   * [Optional] Version of the Meta GraphAPI
   *
   * [default=20]
   */
  version?: number

  /**
   * [Optional] Logger to use
   *
   * [default=undefined]
   */
  log?: Logger

  /**
   * [Optional] Allows to override the internal HTTP request for testing
   *
   * [default=undici.request]
   */
  _request?: RequestFn
}

export interface GraphApiResult {
  contentType: string
  text?: string | undefined
  json?: Record<string, unknown> | undefined
  buffer?: ArrayBuffer | undefined
}

export type RequestFn = (
  url: string,
  init: GraphApiRequest
) => Promise<GraphApiResponse>

export interface GraphApiRequest {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: string | FormData
  headers?: Record<string, string | string[] | undefined>
}

export interface GraphApiResponse {
  statusCode: number
  headers: Record<string, string | string[] | undefined>
  body: Body
}

interface Body {
  text: () => string | Promise<string>
  json: () => unknown | Promise<unknown>
  arrayBuffer: () => ArrayBuffer | Promise<ArrayBuffer>
}

export interface GraphApiErrorInit {
  message: string
  type: string
  code: number
  error_subcode: number
  error_user_title: string
  error_user_msg: string
  fbtrace_id: string
}

export declare class GraphApiError extends BaseError implements GraphApiError { }
