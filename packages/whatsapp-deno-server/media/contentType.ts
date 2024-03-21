export type ContentType =
  "audio/aac" |
  "audio/amr" |
  "audio/mp4" |
  "audio/mpeg" |
  "audio/ogg" |
  "image/jpeg" |
  "image/png" |
  "video/3gp" |
  "video/mp4";

export function getContentType(filePath: string): ContentType {
  const suffix = filePath.split(".").pop()!;
  switch (suffix) {
    case "aac":
      return "audio/aac";
    case "amr":
      return "audio/amr";
    case "mp3":
      return "audio/mpeg";
    case "ogg":
      return "audio/ogg";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "3gp":
      return "video/3gp";
    case "mp4":
      return "video/mp4";
    default:
      throw new Error(`Unknown file type: ${suffix}`);
  }
}
