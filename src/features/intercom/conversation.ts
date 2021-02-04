import { app, intercomClient, store } from "../../index";
import { lookupSlackIdByEmail } from "../../utils";
import {
  newConversationBlock,
  newConversationMetaBlock
} from "../../views/newConversation";
import { newReplyBlock } from "../../views/newReply";

export const notifyNewConversation = async item => {
  const user = (await intercomClient.users.find({ id: item.user.id })).body;

  let company;
  if (user.companies.companies.length > 0) {
    company = (await intercomClient.companies.find({ id: user.companies.companies[0].id })).body;
  }

  let assignee = null;
  if (item.assignee.type != "nobody_admin") {
    const slackUserID = await lookupSlackIdByEmail(item.assignee.email);
    assignee = slackUserID ? slackUserID : item.assignee.name;
  }

  let attachments = [];
  if (user && company) {
    attachments =[{
      color: "#286efa",
      blocks: newConversationMetaBlock({ company, user, assignee })
    }];
  }

  const res = await app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: store.linkedChannel,
    text: "new conversation",
    blocks: newConversationBlock({ item, user }),
    attachments,
  });

  if (res.ts) {
    store.saveTsByConv({ ts: res.ts as string, convId: item.id });
  }
};

export const notifyReplyConversation = async item => {
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
    channel: store.linkedChannel,
    text: "new reply",
    blocks,
    thread_ts: ts,
    reply_broadcast: true
  });
  if (!ts && res.ts) {
    store.saveTsByConv({ ts: res.ts as string, convId: item.id });
  }
};
