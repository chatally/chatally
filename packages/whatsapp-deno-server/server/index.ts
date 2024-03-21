// Copyright (c) Christian Fuss
import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { send } from "https://deno.land/x/oak@v12.4.0/send.ts";
import { WhatsAppHandler } from "../handler/mod.ts";
import { getLogger, Level } from "../logger.ts";

const log = getLogger("WhatsApp server", Level.DEBUG);

export class WhatsAppServer {
  readonly #router: Router;

  constructor() {
    this.#router = new Router();
    this.#router.get("/health", (ctx) => {
      ctx.response.body = "WhatsApp server up and running";
    });
  }

  set assets(root: string) {
    this.#router.get("/assets/:path+", async (ctx) => {
      const { path } = ctx.params;
      if (path) {
        log.debug("Serving asset", path);
        await send(ctx, path, { root });
      }
    });
  }

  addRoute(route: string, handler: WhatsAppHandler) {
    this.#router.get(route, handler.get);
    this.#router.post(route, handler.post);
  }

  async serve(port: number) {
    const app = new Application();
    app.addEventListener("error", (evt) => {
      log.error("Uncaught error:", evt.error);
    });

    app.use(this.#router.routes());
    app.use(this.#router.allowedMethods());

    log.info(`WhatsApp server running at http://localhost:${port}/`);
    await app.listen({ port });
  }
}
