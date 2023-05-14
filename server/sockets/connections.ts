import { Server, Socket } from "socket.io";

const connectionsHandler = (io: Server) => {
  let clients: any[] = [];

  io.on("connection", (socket: Socket) => {
    console.log(`🥳 ${socket.id} connected`);
    clients.push(socket.id);
    io.sockets.emit("getconnected", { connected: clients.length });

    socket.on("listeningForRegister", () => {
      console.log(`👂 ${socket.id} is listening for register`);
      socket.join("register");
    });

    socket.on("disconnect", () => {
      console.log(`😢 ${socket.id} disconnected`);
      clients.splice(clients.indexOf(socket.id), 1);
      io.sockets.emit("getconnected", { connected: clients.length });
    });
  });
};

export default connectionsHandler;
