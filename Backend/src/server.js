import { Server } from "socket.io";
import app from "./app.js";
import { handleSocket } from "./handleSocket.js";

const io = new Server(app, {
  pingTimeout: 60000,
  cors: { origin: "*" },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});

io.on("connection", handleSocket);
