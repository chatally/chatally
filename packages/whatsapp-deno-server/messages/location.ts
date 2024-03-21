/** Copyright (c) Christian Fuss */

/**
 * Location Object.
 *
 * https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#location-object
 */
export interface Location {
  /** Longitude of the location. */
  longitude: number;
  /** Latitude of the location. */
  latitude: number;
  /** Name of the location. */
  name?: string;
  /** Address of the location. Only displayed if name is present. */
  address?: string;
}

export interface LocationMessage {
  type: "location";
  location: Location;
}
