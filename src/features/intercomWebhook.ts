import { receiver, app, intercomClient } from "../index";
import { lookupSlackIdByEmail } from "../utils";

const CHANNEL = "CSN74GSQ5";

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
  if (item.assignee) {
    const slackUserID = await lookupSlackIdByEmail(item.assignee.email);
    assignee = slackUserID ? slackUserID : item.assignee.name;
  }

  app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    text: `
    社名: ${company.name} (${company.custom_attributes.subdomain})
    アカウント数: ${company.user_count}
    名前: ${user.name}
    Mixpanel: ${user.user_id}
    ロール: ${user.custom_attributes.accountType}
    platform: ${user.custom_attributes.platform}
    内容: ${item.conversation_message.body}
    アサイン: <@${assignee}>
    `,
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
