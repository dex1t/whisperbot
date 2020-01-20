import { app } from "./index";

export const lookupSlackIdByEmail = async (email: string) => {
  try {
    const data: any = await app.client.users.lookupByEmail({
      token: process.env.SLACK_BOT_TOKEN,
      email: email.replace(".team", ".com")
    });
    return data.user.id;
  } catch (e) {
    if (e.data.error == "users_not_found") {
      return null;
    }
  }
};

export const fetchAvatarUrl = user => {
  return (
    user.custom_attributes.avatar ||
    `https://dummyimage.com/150x150/${Number(user.created_at).toString(
      16
    )}/ffffff.png&text=no+photo`
  );
};
