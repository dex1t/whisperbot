import { receiver, app } from "../index";

const CHANNEL = "CSN74GSQ5";

export default function() {
  receiver.app.get("/", (req, res) => {
    res.status(200).send("It Works!");
  });

  receiver.app.post("/intercom", (req, res) => {
    // @ts-ignore
    if (!req.isXHub) {
      res.status(403).send("X-Hub-Signature is invalid");
      return;
    }
    res.sendStatus(200);

    console.log(req.body);

    app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      text: "from webhook",
      channel: CHANNEL
    });
  });
}
