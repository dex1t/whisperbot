import { app } from "../index";

export default function() {
  app.command(`/whisperbot-echo`, async ({ command, ack, say }) => {
    ack();
    say(command.text + ":ghost:");
  });

  app.command(`/whisperbot-subscribe`, async ({ command, ack, respond }) => {
    ack();
    respond({
      text: `OK :+1: I'm subscribing \`${command.text}\` on Intercom.`,
      response_type: "ephemeral"
    });
  });
}
