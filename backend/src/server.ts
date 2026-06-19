import "dotenv/config";
import { loadEnv } from "./config/env";
import { connectToDatabase } from "./config/mongo";
import { createApp } from "./http/createApp";
import {
  mongoAvatarRepository,
  mongoMapRepository,
  mongoUserRepository,
} from "./repositories/mongoRepositories";
import { startServers } from "./realtime/server";

async function bootstrap() {
  const env = loadEnv();
  await connectToDatabase(env.MONGODB_URI);

  const app = createApp({
    env,
    repositories: {
      users: mongoUserRepository,
      maps: mongoMapRepository,
      avatars: mongoAvatarRepository,
    },
  });

  await startServers({
    app,
    apiPort: env.API_PORT,
    jwtSecret: env.JWT_SECRET,
    wsPort: env.WS_PORT,
  });

  console.log(`Office Metaverse API listening on ${env.API_BASE_URL}`);
  console.log(`Office Metaverse realtime listening on ${env.WS_BASE_URL}`);
}

bootstrap().catch((error) => {
  console.error("Failed to bootstrap Office Metaverse:", error);
  process.exit(1);
});
