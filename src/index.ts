import { App } from "@slack/bolt";
import { Store } from "./store";
import echo from "./features/command";

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const store = new Store({
  port: 6379,
  host: "localhost"
});

(async () => {
  const server = await app.start(process.env.PORT || 3000);
  console.log(await store.saveByChannel("100", "hellooo"));
  console.log(await store.loadByChannel("100"));
  console.log(`⚡️ Bolt app is running!`);
})();

echo();
