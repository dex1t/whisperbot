import { app, store, intercomClient } from "../index";

export default function() {
  app.command(`/whisperbot-status`, async ({ command, ack, respond }) => {
    ack();

    const channelId = await store.loadLinkingChannel();
    let counts = await intercomClient.counts.appCounts();
    counts = counts.body;

    if (channelId) {
      respond({
        text: `Linked <#${channelId}> to Intercom \`(${counts.company.count} companies, ${counts.user.count} users)\``,
        response_type: "ephemeral"
      });
    } else {
      respond({ text: "No link to channel", response_type: "ephemeral" });
    }
  });

  app.command(`/whisperbot-link`, async ({ command, ack, respond }) => {
    ack();
    store.saveLinkingChannel({ channelId: command.channel_id });
    respond({
      text: `OK :+1: Linked <#${command.channel_id}> to Intercom. Please invite me to this channel.\n\`/invite @whisperbot\``,
      response_type: "ephemeral"
    });
  });
}
