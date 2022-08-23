import { Server, Socket } from 'socket.io';
import { Server as httpServerType } from 'http';
import { assertExists } from '../utils/types';
const WEBSOCKET_CORS = {
   origin: "*",
   methods: ["GET", "POST"]
}

class Websocket extends Server {

   private static io: Websocket;

   constructor(httpServer: httpServerType) {
       super(httpServer, {
           cors: WEBSOCKET_CORS
       });
   }

   public static getInstance(httpServer?: httpServerType): Websocket {

       if (!Websocket.io) {
            httpServer = assertExists(httpServer)
           Websocket.io = new Websocket(httpServer);
       }

       return Websocket.io;

   }
    public initializeHandlers(socketHandlers: Array<any>) {
    socketHandlers.forEach(element => {
        let namespace = Websocket.io.of(element.path, (socket: Socket) => {
            element.handler.handleConnection(socket);
        });

        if (element.handler.middlewareImplementation) {
            namespace.use(element.handler.middlewareImplementation);
        }
    });
}
}

export default Websocket;