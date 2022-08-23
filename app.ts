import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import logger from "./utils/logger";


import socket from "./socket";

const port = 8282
const host = 'localhost'
const corsOrigin ="http://localhost:64000"

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});

app.get("/", (_, res) =>
  res.send(`Server is up and running.`)
);

httpServer.listen(port, host, () => {
  logger.info(`🚀 Server is listening 🚀`);
  logger.info(`http://${host}:${port}`);

  socket({ io });
});