export const newReplyBlock = (params: { item: any; user: any }) => {
  let text = params.item.conversation_parts.conversation_parts[0].body;
  text = text
    .replace(/\<img\ssrc=["'](.*)["']>/g, "$1")
    .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "");
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text
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
