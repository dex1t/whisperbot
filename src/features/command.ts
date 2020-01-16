import { app } from "../bolt";

export default function() {
  app.command(`/echo`, async ({ command, ack, say }) => {
    ack();

    say(`${command.text}`);
  });
}
