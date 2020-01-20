import { receiver, app, intercomClient, store } from "../index";
import { lookupSlackIdByEmail } from "../utils";
import {
  newConversationBlock,
  newConversationMetaBlock
} from "../views/newConversation";
import { newReplyBlock } from "../views/newReply";
import { closedOpsBlock } from "../views/staffOps";

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

  const res = await app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: CHANNEL,
    text: "new conversation",
    blocks: newConversationBlock({ item, user }),
    attachments: [
      {
        color: "#286efa",
        blocks: newConversationMetaBlock({ company, user, assignee })
      }
    ]
  });
  if (res.ts) {
    store.saveTsByConv({ ts: res.ts as string, convId: item.id });
  }
};

const notifyReplyConversation = async item => {
  const ts = await store.loadTsByConv({ convId: item.id });

  const author = item.conversation_parts.conversation_parts[0].author;
  let blocks = [];
  if (author.type == "user") {
    const user = await intercomClient.users.find({ id: author.id });
    blocks = newReplyBlock({ item, user: user.body });
  } else {
    const staff = await intercomClient.admins.find(author.id);
    blocks = newReplyBlock({ item, user: staff.body });
  }

  const res = await app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: CHANNEL,
    text: "new reply",
    blocks,
    thread_ts: ts,
    reply_broadcast: true
  });
  if (!ts && res.ts) {
    store.saveTsByConv({ ts: res.ts as string, convId: item.id });
  }
};

const closedConversation = async item => {
  const ts = await store.loadTsByConv({ convId: item.id });

  const author = item.conversation_parts.conversation_parts[0].author;
  let blocks = [];
  if (author.type == "admin") {
    const staff = await intercomClient.admins.find(author.id);
    blocks = closedOpsBlock({ item, staff: staff.body });
  }

  app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: CHANNEL,
    text: "closed conversation",
    blocks,
    thread_ts: ts,
    reply_broadcast: true
  });
  store.deleteByConv({ convId: item.id });
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
        notifyNewConversation(body.data.item);
        break;
      case "conversation.user.replied":
      case "conversation.admin.replied":
        notifyReplyConversation(body.data.item);
        break;
      case "conversation.admin.closed":
        closedConversation(body.data.item);
        break;
      default:
        console.log(`${body.topic} is not supported.`);
    }
  });
}
