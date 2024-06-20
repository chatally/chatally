import { fstatSync, mkdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { GraphApi } from "./graph-api.js";
import { Media } from "./media.js";
import fs from "node:fs/promises";
import { nanoid } from "nanoid";

const downloadUrl = "https://download.here";

function newMedia() {
  /** @type {Array<{url: string, req: import("./graph-api.js").RequestInit, res: import("./graph-api.js").ResponseData}>} */
  const requests = [];
  const graphApi = new GraphApi({
    phoneNumberId: "1234",
    accessToken: "ABCD",
    _request: async (url, req) => {
      const reqKind = url.startsWith(downloadUrl)
        ? "download"
        : req.method === "POST"
          ? "upload"
          : "mediaQuery";
      const contentType =
        reqKind === "download"
          ? "image/jpeg"
          : "text/javascript; charset=UTF-8";
      const result =
        reqKind === "upload"
          ? { id: "12345678" }
          : reqKind === "mediaQuery"
            ? { url: `${downloadUrl}/12345678` }
            : undefined;
      const text = () => JSON.stringify(result);
      const json = () => ({});
      const arrayBuffer =
        reqKind === "download"
          ? () => readFileSync("./testing/image.jpg").buffer
          : () => new ArrayBuffer(0);
      const res = {
        statusCode: 200,
        headers: { "content-type": contentType },
        body: { text, json, arrayBuffer },
      };
      requests.push({ url, req, res });
      return res;
    },
  });
  const downloadDir = `./testing/media-${nanoid()}`;
  mkdirSync(downloadDir);
  const media = new Media({
    graphApi,
    downloadDir,
    dbPath: `${downloadDir}/ids.db`,
  });
  function cleanup() {
    rmSync(downloadDir, { recursive: true, force: true });
  }
  return { media, requests, cleanup };
}

const original = "./testing/image.jpg";
const copied = "./testing/renamed-image.jpg";

describe("Media", async function () {
  it("does not re-download uploaded media", async function () {
    const { media, requests, cleanup } = newMedia();
    try {
      const id = await media.upload(original);
      const downloaded = await media.download(id);
      expect(downloaded).toEqual(original);
    } finally {
      cleanup();
    }
  });
  it("downloads media, if it does not exist", async function () {
    const { media, requests, cleanup } = newMedia();
    try {
      await fs.copyFile(original, copied);
      const id = await media.upload(copied);
      await fs.rm(copied);
      const downloaded = await media.download(id);
      expect(downloaded.endsWith(`/${id}.jpeg`)).toBeTruthy();
      expect(requests.length).toEqual(3);
      expect(requests[0].req.method).toEqual("POST");
      expect(requests[2].url.startsWith(downloadUrl));
      expect(statSync(downloaded).size).toEqual(statSync(original).size);
    } finally {
      cleanup();
    }
  });
});
