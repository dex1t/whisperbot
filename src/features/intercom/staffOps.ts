import { app, intercomClient, store } from "../../index";
import { closedOpsBlock, internalNoteBlock } from "../../views/staffOps";

const CHANNEL = "CSN74GSQ5"; // FIXME

export const notifyPing = async () => {
  app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    text: "pong",
    channel: CHANNEL
  });
};

export const closedConversation = async item => {
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

export const addInternalNote = async item => {
  console.log(item.conversation_parts);
  const ts = await store.loadTsByConv({ convId: item.id });

  const author = item.conversation_parts.conversation_parts[0].author;
  let blocks = [];
  if (author.type == "admin") {
    const staff = await intercomClient.admins.find(author.id);
    blocks = internalNoteBlock({ item, staff: staff.body });
  }

  app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: CHANNEL,
    text: "📝 *スタッフ用メモ*",
    attachments: [
      {
        color: "#fbc916",
        blocks
      }
    ],
    thread_ts: ts,
    reply_broadcast: true
  });
};
