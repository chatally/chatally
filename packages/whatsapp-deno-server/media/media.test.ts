import { assertEquals, assertRejects } from "https://deno.land/std@0.188.0/testing/asserts.ts";
import { GraphApi } from "../graph_api.ts";
import { Media } from "./media.ts";
import { MediaError } from "../errors.ts";
import { mockGraphApi } from "../graph-api.mock.ts";

function createMedia(port: number) {
  const graphApi = new GraphApi({
    id: "123",
    accessToken: "abc",
    baseUrl: "localhost",
    basePort: port,
  })
  return new Media(graphApi);
}

Deno.test("Upload png file to mock server", async function () {
  const { close, port } = mockGraphApi();
  const media = createMedia(port);
  const { id, size, name } = await media.upload("./fixtures/test.png");
  console.log(`File '${name}' (size=${size}) uploaded to media id ${id}`);
  assertEquals(size, 500650);
  await close();
});

Deno.test("Upload 'Not found'", async function () {
  const { close, port } = mockGraphApi();
  const media = createMedia(port);
  assertRejects(
    async () => { await media.upload("./fixtures/missing.mp4"); },
    MediaError,
    "Media upload: File not found './fixtures/missing.mp4'"
  );

  await close();
});

