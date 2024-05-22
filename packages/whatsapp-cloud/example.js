import { Application } from "@chatally/core";
import { WhatsAppCloud } from "./lib/index.js";

const phoneNumberId = "YOUR PHONE NUMBER";
const accessToken = "YOUR ACCESS TOKEN";
const verifyToken = "YOUR WEBHOOKS VERIFY TOKEN";
const secret = "YOUR WEBHOOKS VALIDATION SECRET";

const whatsapp = new WhatsAppCloud({
  env: false, // do not read configuration from environment variables
  file: false, // do not read configuration from default configuration files
  graphApi: { phoneNumberId, accessToken },
  webhooks: { verifyToken, secret },
});

new Application() //
  .use(whatsapp)
  .use(function echo({ req, res }) {
    if (res.isWritable) {
      res.write(`You said '${req.text}' and I don't know what it means.`);
    }
  })
  .listen();
