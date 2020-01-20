import { fetchAvatarUrl } from "../utils";

export const closedOpsBlock = (params: { item: any; staff: any }) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `✅ *${params.item.user.name}との会話をCloseしました*`
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
