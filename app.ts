import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import logger from "./src/utils/logger";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

import socket from "./src/socket";

const port = 8282
const host = 'localhost'
const corsOrigin ="http://localhost:4040"

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});


const {
  APP_BACKEND_URL = 'https://balanced.currents.fm',
  REDIS_HOST = 'localhost',
  REDIS_PORT = 6379,
  REDIS_USER_NAME = 'default',
  REDIS_PASSWORD = '',
  MAX_MESSAGE_COUNT = 200, // Assigns a default value, just in case
  PRIVATE_ROOM_MAX = 10,
} = process.env

const redisURL = `redis://${REDIS_USER_NAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;
const pubClient = createClient({url: redisURL})
const subClient = pubClient.duplicate()


pubClient.on('connect', ( err) => {
  if (err) {
    logger.info('redis pub connection error!', err)
    return
  }
  logger.info('redis pub connected!')


})

subClient.on('connect', ( err) => {
  if (err) {
    logger.info('redis sub connection error!', err)
    return
  }
  logger.info('redis sub connected!')

})

pubClient.on('error', err => {
  logger.info('redis error!', err)
})


app.get("/", (_, res) =>
  res.send(`Server is up and running.`)
);



Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  logger.info('Connections made - moving onto adapter')

  io.adapter(createAdapter(pubClient, subClient));
  logger.info('Adapter Created')
  httpServer.listen(port, host, () => {
    logger.info(`🚀 Server is listening 🚀`);
    logger.info(`http://${host}:${port}`);
    socket({ io });
  });
});

// const startApp = async () => {
//   try {
//     const pub = await pubClient.connect()
//     const sub = await subClient.connect()
//     logger.info('Connections made - moving onto adapter')

//     io.adapter(createAdapter(pub, sub));
//     logger.info('Adapter Created')
//     httpServer.listen(port, host, () => {
//       logger.info(`🚀 Server is listening 🚀`);
//       logger.info(`http://${host}:${port}`);
//       socket({ io });
//     });
    
//   } catch (error) {
//     logger.error(error)
//   }
    
//   }
 


// startApp()