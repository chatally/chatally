/** Copyright (c) Christian Fuss */

import { getLogger } from "./logger.ts";
import { GraphApi } from "./graph_api.ts";

const log = getLogger("TwoStepVerification");

/**
 *  Two-step verification API.
 *
 * Set up two-step verification for your phone number, as this provides an
 * extra layer of security to the business accounts.
 *
 * It makes a POST call to `/PHONE_NUMBER_ID` (no endpoint) and attaches the
 * given PIN. There is no endpoint to disable two-step verification.
 *
 * For details, see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/two-step-verification
 */
export class TwoStepVerification {
  constructor(private readonly graphApi: GraphApi) { }

  /**
   * Set up two-step verification for your phone number.
   *
   * @param pin A 6-digit PIN you wish to use for two-step verification.
   * @returns true if the PIN was successfully set.
   */
  async setPin(
    pin: number,
  ) {
    log.info(
      `Setting two-step verification pin for Phone Number Id ${this.graphApi.id}`,
    );

    const { success } = await this.graphApi.request<{ success: boolean }>({
      method: "POST",
      endpoint: "",
      body: {
        pin,
      },
    });
    return success;
  }
}
