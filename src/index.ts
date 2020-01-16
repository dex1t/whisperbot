import { App } from "@slack/bolt";
import echo from "./features/command";

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

(async () => {
  const server = await app.start(process.env.PORT || 3000);
  console.log(`⚡️ Bolt app is running!`);
})();

echo();
