import { app, store, intercomClient } from "../index";

export default function() {
  app.command(`/whisperbot-status`, async ({ command, ack, respond }) => {
    ack();

    let counts = await intercomClient.counts.appCounts();
    counts = counts.body;

    if (store.linkedChannel) {
      respond({
        text: `Linked <#${store.linkedChannel}> to Intercom \`(${counts.company.count} companies, ${counts.user.count} users)\``,
        response_type: "ephemeral"
      });
    } else {
      respond({ text: "No link to channel", response_type: "ephemeral" });
    }
  });

  app.command(`/whisperbot-link`, async ({ command, ack, respond }) => {
    ack();

    if (!store.linkedChannel || command.text == "overwrite") {
      store.saveLinkingChannel({ channelId: command.channel_id });
      respond({
        text: `OK :+1: Linked <#${command.channel_id}> to Intercom. Please invite me to this channel.\n\`/invite @whisperbot\``,
        response_type: "ephemeral"
      });
    } else if (store.linkedChannel) {
      respond({
        text: `Hmm :thinking_face: Already linked <#${store.linkedChannel}> to Intercom. If you wanna overwrite, run the following command:\n\`/whisperbot-link overwrite\``,
        response_type: "ephemeral"
      });
    }
  });
}
