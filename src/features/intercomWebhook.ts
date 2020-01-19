import { receiver, app } from "../index";

const CHANNEL = "CSN74GSQ5";

const notifyPing = () => {
  app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    text: "pong",
    channel: CHANNEL
  });
};

export default function() {
  receiver.app.get("/", (req, res) => {
    res.status(200).send("It Works!");
  });

  receiver.app.post("/intercom", (req, res) => {
    // @ts-ignore
    if (!req.isXHub) {
      res.status(403).send("X-Hub-Signature is invalid.");
      return;
    } else {
      res.sendStatus(200);
    }

    const body = req.body;
    switch (body.topic) {
      case "ping":
        notifyPing();
        break;
      case "conversation.user.created":
      case "conversation.user.replied":
      case "conversation.admin.replied":
        break;
      default:
        console.warn(`${body.topic} is not supported.`);
    }
  });
}
