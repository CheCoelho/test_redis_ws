import { Socket } from "socket.io";
import SocketInterface from "./SocketInterface";
import { NextFunction } from 'express'
import Websocket from "../websocket/websocket";

class ChatSocket implements SocketInterface {

   handleConnection(socket: Socket) {

        socket.emit('ping', 'Hi! I am a live socket connection');

    }

   middlewareImplementation(socket: Socket, next: NextFunction) {
       //Implement your middleware for orders here
       return next();
   }
   public insertOrder(order) {
    //save in your database

    //send the update to the browser
    this.updateSockets(order);
}
private updateSockets(order) {
    const io = Websocket.getInstance();
    io.of('orders').emit('message_received', { data: [order] });
}
}

export default ChatSocket;