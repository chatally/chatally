import { WhatsApp } from "../mod.ts";

/**
 * Make sure you have a .env file with the following variables:
 * - GRAPH_API_ID
 * - GRAPH_API_ACCESS_TOKEN
 */
const { media } = new WhatsApp({
  graphApi: { dryRun: false }
});

try {
  // const mediaId = await media.upload("./fixtures/test.png");
  // console.log("Uploaded media id", mediaId);
  // const mediaId = "260739219932171";
  const mediaId = "260739219932172";
  const mediaUrl = await media.getUrl(mediaId);
  console.log("Media url", mediaUrl);
} catch (e) {
  console.error(e);
}
