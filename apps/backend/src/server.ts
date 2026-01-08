import { createApp } from "./app";
import { createSocketServer } from "./socket";
import { env } from "./config/env";
import { createServer } from "node:http";

const app = createApp();
const httpServer = createServer(app);

createSocketServer(httpServer);

httpServer.listen(env.port, () => {
  console.log(`🚀 Server running on http://localhost:${env.port}`);
});
