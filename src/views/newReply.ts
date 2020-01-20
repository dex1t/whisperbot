export const newReplyBlock = (params: { item: any; user: any }) => {
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
          type: "image",
          image_url: params.user.custom_attributes.avatar,
          alt_text: "avatar"
        },
        {
          type: "mrkdwn",
          text: `*${params.user.name}が返信* <${params.item.links.conversation_web}|View in Intercom>`
        }
      ]
    }
  ];
};
