import { MediaError } from "../errors.ts";
import { GraphApi } from "../graph_api.ts";
import { FS } from "../runtime.ts";
import { getContentType } from "./contentType.ts";

interface UploadResponse {
  id: string;
  size: number;
  name: string;
}

interface GetUrlResponse {
  url: string;
}

export class Media {
  constructor(private readonly graphApi: Pick<GraphApi, "request">) { }

  async upload(filePath: string) {
    if (!await FS.exists(filePath)) {
      throw new MediaError(`Media upload: File not found '${filePath}'`);
    }
    const contentType = getContentType(filePath);
    const filename = filePath.split("/").pop()!;
    const { size } = await FS.stat(filePath);
    checkSize(size, contentType);
    const blob = await FS.readFile(filePath);

    const body = new FormData();
    body.append("messaging_product", "whatsapp");
    body.append("type", contentType);
    body.append("file", new Blob([blob], { type: contentType }), filename);
    const response = await this.graphApi.request<UploadResponse>({
      method: "POST",
      endpoint: "media",
      body
    });

    if (!("id" in response)) {
      throw new MediaError(`[Media] upload: Invalid response ${JSON.stringify(response)}`);
    }
    return response;
  }

  async getUrl(id: string) {
    const response = await this.graphApi.request<GetUrlResponse>(
      { method: "GET", id }
    );

    if (!("url" in response)) {
      throw new MediaError(`[Media] getUrl: Invalid response ${JSON.stringify(response)}`);
    }
    return response.url;
  }
}

const MB = 1024 * 1024;
const MAX_SIZE: Record<string, number> = {
  image: 5 * MB,
  video: 16 * MB,
  audio: 16 * MB,
};

function checkSize(size: number, contentType: string) {
  const contentClass = contentType.split("/")[0];
  const maxSize = MAX_SIZE[contentClass];
  if (size > maxSize) {
    throw new MediaError(`[Media] upload: File size exceeds limit of ${maxSize} bytes for content type '${contentType}'`);
  }
}

// Experiment with streaming request body (is currently not supported by the Graph API)
// async #upload_multipartWriter(filePath: string) {
//   const filename = filePath.split("/").pop()!;
//   const contentType = getFileType(filename);
//   const contentLength = 393 + filename.length + Deno.statSync(filePath).size;
//   const [stream, boundary] = streamFromMultipart(async (multipartWriter) => {
//     const file = await Deno.open(filePath, { read: true });
//     await multipartWriter.writeFile("file", filename, file);
//     await multipartWriter.writeField("type", contentType);
//     await multipartWriter.writeField("messaging_product", "whatsapp");
//     file.close();
//   });
//   const response = await this.graphApi.request<MediaUploadResponse>({
//     endpoint: "media",
//     method: "POST",
//     body: { stream, boundary, contentLength }
//   });
//   return response.id;
// }

