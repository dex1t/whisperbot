import { app } from "./bolt";
import echo from "./features/command";

(async () => {
  const server = await app.start(process.env.PORT || 3000);
  console.log(`⚡️ Bolt app is running! PORT: ${server.address().port}`);
})();

echo();
