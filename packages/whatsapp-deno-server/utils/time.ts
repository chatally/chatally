const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;

export const Time = {
  second,
  minute,
  hour,
  day,
  week,
};

/**
 * Return the current timestamp in seconds.
 *
 * Seconds since the Unix epoch, this is the same used by the WhatsApp API.
 */
export function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function isoTime() {
  return new Date().toISOString();
}
