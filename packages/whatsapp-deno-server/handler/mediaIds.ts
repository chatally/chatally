import { Media } from "../media/media.ts";
import { FS } from "../runtime.ts";
import { Time } from "../utils/time.ts";

interface Upload {
  mediaId: string;
  timestamp: number;
}

export type GetMediaId = (link: string) => Promise<string>;

export class MediaIds {
  #busy = false;

  private constructor(
    private media: Media,
    private file: string,
    private map: Map<string, Upload>,
  ) {
  }

  static async load(media: Media, dataDir: string): Promise<MediaIds> {
    const map = new Map<string, Upload>();
    const file = `${dataDir}/assets/media-ids.json`;
    if (await FS.exists(file)) {
      const json = FS.readJson(file);
      for (const [link, upload] of Object.entries(json)) {
        map.set(link, upload as Upload);
      }
    }
    const mediaIds = new MediaIds(media, file, map);
    return mediaIds;
  }

  async #setMediaId(link: string, mediaId: string) {
    while (this.#busy) {
      // Wait for other write to finish
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    this.#busy = true;
    this.map.set(link, { mediaId, timestamp: Date.now() });
    await FS.writeJson(
      this.file,
      Object.fromEntries(this.map),
    );
    this.#busy = false;
  }

  async getMediaId(link: string): Promise<string> {
    if (this.map.has(link)) {
      let { mediaId, timestamp } = this.map.get(link)!;
      if (Date.now() - timestamp < 28 * Time.day) {
        return mediaId;
      } else {
        try {
          await this.media.getUrl(mediaId);
        } catch (_e) {
          mediaId = (await this.media.upload(link)).id;
          this.#setMediaId(link, mediaId);
        }
        return mediaId;
      }
    } else {
      const mediaId = (await this.media.upload(link)).id;
      this.#setMediaId(link, mediaId);
      return mediaId;
    }
  }
}
