import { Server, Socket } from "socket.io";

const connectionsHandler = (io: Server) => {
  let clients: any[] = [];

  io.on("connection", (socket: Socket) => {
    console.log(`🥳 ${socket.id} connected`);
    clients.push(socket.id);

    socket.on("disconnect", () => {
      console.log(`😢 ${socket.id} disconnected`);
      clients.splice(clients.indexOf(socket.id), 1);
    });
  });
};

export default connectionsHandler;
