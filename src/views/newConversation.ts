import { fetchAvatarUrl } from "../utils";

export const newConversationBlock = (params: { item: any; user: any }) => {
  let text = params.item.conversation_message.body;
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
          type: "mrkdwn",
          text: `💁‍♂️ *${params.user.name}から新規メッセージ* | <${params.item.links.conversation_web}|Open Intercom>`
        }
      ]
    }
  ];
};

export const newConversationMetaBlock = (params: {
  company: any;
  user: any;
  assignee: string | null;
}) => {
  return [
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Name:*\n${params.user.name}`
        },
        {
          type: "mrkdwn",
          text: `*Company:*\n${params.company.custom_attributes.subdomain} (${params.company.user_count} users)`
        },
        {
          type: "mrkdwn",
          text: `*Account Type:*\n${params.user.custom_attributes.accountType}`
        },
        {
          type: "mrkdwn",
          text: `*Platform:*\n${params.user.custom_attributes.platform}`
        },
        {
          type: "mrkdwn",
          text: `*Behavior:*\n<https://mixpanel.com/report/${process.env.MIXPANEL_REPORT_ID}/explore#user?distinct_id=${params.user.user_id}|Open Mixpanel>`
        },
        {
          type: "mrkdwn",
          text: `*Assignee:*\n${
            params.assignee ? `<@${params.assignee}>` : "No assignment"
          }`
        }
      ],
      accessory: {
        type: "image",
        image_url: fetchAvatarUrl(params.user),
        alt_text: "avatar"
      }
    }
  ];
};
