import { App, ExpressReceiver } from "@slack/bolt";
import { Store } from "./store";
import slashCommands from "./features/slashCommands";
import intercomWebhook from "./features/intercomWebhook";

const Intercom = require("intercom-client");
export const intercomClient = new Intercom.Client({
  token: process.env.INTERCOM_ACCESS_TOKEN
});

export const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const bodyParser = require("body-parser");
const xhub = require("express-x-hub");
receiver.app.use(bodyParser.urlencoded({ extended: true }));
receiver.app.use(
  xhub({ algorithm: "sha1", secret: process.env.INTERCOM_CLIENT_SECRET })
);
receiver.app.use(bodyParser.json());

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver
});

export const store = new Store({
  port: 6379,
  host: process.env.REDIS_HOST
});

(async () => {
  const server = await app.start(process.env.PORT || 3000);
  console.log(`⚡️ Bolt app is running!`);
})();

slashCommands();
intercomWebhook();
