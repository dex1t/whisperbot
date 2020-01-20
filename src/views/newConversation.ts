export const newConversationBlocks = (params: {
  item: any;
  company: any;
  user: any;
  assignee: string | null;
}) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: params.item.conversation_message.body.replace(
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
    },
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
          text: `*Assign:*\n${
            params.assignee ? `<@${params.assignee}>` : "No assignment"
          }`
        }
      ],
      accessory: {
        type: "image",
        image_url: params.user.custom_attributes.avatar,
        alt_text: "avatar"
      }
    }
  ];
};
