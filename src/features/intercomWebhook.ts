import { receiver, app, intercomClient } from "../index";
import { lookupSlackIdByEmail } from "../utils";
import { newConversationBlocks } from "../views/newConversation";

const CHANNEL = "CSN74GSQ5"; // FIXME

const notifyPing = async () => {
  app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    text: "pong",
    channel: CHANNEL
  });
};

const notifyNewConversation = async item => {
  let user = await intercomClient.users.find({ id: item.user.id });
  let company = await intercomClient.companies.find({
    id: user.body.companies.companies[0].id
  });
  user = user.body;
  company = company.body;

  let assignee = null;
  if (item.assignee.type != "nobody_admin") {
    const slackUserID = await lookupSlackIdByEmail(item.assignee.email);
    assignee = slackUserID ? slackUserID : item.assignee.name;
  }
  console.log(item);
  console.log(user.custom_attributes.avatar);

  app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    text: "",
    blocks: newConversationBlocks({ item, company, user, assignee }),
    channel: CHANNEL
  });
};

const notifyReplyConversation = item => {
  console.log(item.user);
  console.log(item.assignee);
  console.log(item.conversation_parts);
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
        console.log(body);
        notifyNewConversation(body.data.item);
        break;
      case "conversation.user.replied":
      case "conversation.admin.replied":
        console.log(body);
        notifyReplyConversation(body.data.item);
        break;
      default:
        console.warn(`${body.topic} is not supported.`);
    }
  });
}
