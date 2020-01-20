export const newReplyBlock = (params: { item: any }) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: params.item.conversation_parts.conversation_parts[0].body.replace(
          /<("[^"]*"|'[^']*'|[^'">])*>/g,
          ""
        )
      }
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `<${params.item.links.conversation_web}|View in Intercom>`
        }
      ]
    }
  ];
};
