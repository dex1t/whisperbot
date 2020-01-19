import { receiver, app } from "../index";

const CHANNEL = "CSN74GSQ5";
const SUPPORT_TOPICS = [
  "ping", // test topic from developer hub
  "conversation.user.created",
  "conversation.user.replied",
  "conversation.admin.replied"
];

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
    let msg = "";
    if (!SUPPORT_TOPICS.includes(body.topic)) {
      console.warn(`${body.topic} is not supported.`);
      return;
    }

    switch (body.topic) {
      case "ping":
        msg = "pong";
        break;
    }

    app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      text: msg,
      channel: CHANNEL
    });
  });
}
