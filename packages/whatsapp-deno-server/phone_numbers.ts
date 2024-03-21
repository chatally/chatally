/** Copyright (c) Christian Fuss */

import { GraphApi } from "./graph_api.ts";
import { getLogger } from "./logger.ts";
import { LanguageCode } from "./types.ts";

const log = getLogger("PhoneNumbers");

/**
 * API to verify your phone number for use with the WhatsApp Business Platform.
 *
 * You need to verify the phone number you want to use to send messages to your
 * customers. Phone numbers must be verified using a code sent via an SMS/voice
 * call. The verification process can be done via the Graph API calls
 * {@link requestCode} and {@link verifyCode}.
 *
 * For details, see the [official docs](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers).
 */
export class PhoneNumbers {
  constructor(private graphApi: GraphApi) { }

  /**
   * Verify a phone number using Graph API.
   *
   * Makes a POST request to `PHONE_NUMBER_ID/request_code`.
   * In your call, include your chosen verification method and language.
   *
   * @param code_method Verification method to use. Either "SMS" or "VOICE".
   * @param language Language to use for the verification code.
   * @returns true if the code was successfully requested.
   */
  async requestCode(
    code_method: "SMS" | "VOICE" = "SMS",
    language: LanguageCode = "en",
  ) {
    log.info(
      `Requesting phone number verification code for Phone Number ID ${this.graphApi.id}`,
    );

    const { success } = await this.graphApi.request<{ success: boolean }>({
      method: "POST",
      endpoint: "request_code",
      body: {
        code_method,
        language,
      },
    });
    return success;
  }

  /**
   * Verify the code you received via the method you selected.
   *
   * Finish the verification process by including your code in a POST request to `PHONE_NUMBER_ID/verify_code`.
   *
   * @param code The code you received after calling FROM_PHONE_NUMBER_ID/request_code
   * @returns true if the code was successfully verified.
   */
  async verifyCode(
    code: number,
  ) {
    log.info(
      `Sending phone number verification code ${code} for Phone Number ID ${this.graphApi.id}`,
    );

    const { success } = await this.graphApi.request<{ success: boolean }>({
      method: "POST",
      endpoint: "verify_code",
      body: {
        code,
      },
    });
    return success;
  }
}
