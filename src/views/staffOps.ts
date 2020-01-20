export const closedOpsBlock = (params: { item: any; user: any }) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "✅ メッセージをCloseしました"
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
          text: `*${params.user.name}が操作* <${params.item.links.conversation_web}|View in Intercom>`
        }
      ]
    }
  ];
};
