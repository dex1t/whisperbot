import { fetchAvatarUrl } from "../utils";

export const newReplyBlock = (params: { item: any; user: any }) => {
  let text = params.item.conversation_parts.conversation_parts[0].body;
  text = text
    .replace(/\<img\ssrc=["'](.*)["']>/g, "$1")
    .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "");

  const image_url =
    params.user.type == "user"
      ? fetchAvatarUrl(params.user)
      : params.user.avatar.image_url;
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
          image_url,
          alt_text: "avatar"
        },
        {
          type: "mrkdwn",
          text: `*${params.user.name}が返信* | <${params.item.links.conversation_web}|Open Intercom>`
        }
      ]
    }
  ];
};
