import { receiver } from "../index";
import {
  notifyNewConversation,
  notifyReplyConversation
} from "./intercom/conversation";
import {
  notifyPing,
  closedConversation,
  addInternalNote
} from "./intercom/staffOps";

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
      case "conversation.admin.noted":
        addInternalNote(body.data.item);
        break;
      default:
        console.log(`${body.topic} is not supported.`);
    }
  });
}
