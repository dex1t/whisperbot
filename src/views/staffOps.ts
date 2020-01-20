export const closedOpsBlock = (params: { item: any; staff: any }) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `✅ *${params.item.user.name}との会話をクローズしました*`
      }
    },
    {
      type: "context",
      elements: [
        {
          type: "image",
          image_url: params.staff.avatar.image_url,
          alt_text: "avatar"
        },
        {
          type: "mrkdwn",
          text: `*${params.staff.name}が操作* | <${params.item.links.conversation_web}|Open Intercom>`
        }
      ]
    }
  ];
};

export const internalNoteBlock = (params: { item: any; staff: any }) => {
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
          image_url: params.staff.avatar.image_url,
          alt_text: "avatar"
        },
        {
          type: "mrkdwn",
          text: `*${params.staff.name}が記入* | <${params.item.links.conversation_web}|Open Intercom>`
        }
      ]
    }
  ];
};
