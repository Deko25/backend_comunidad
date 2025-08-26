function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("user connected");

    // Escuchar mensaje del cliente
    socket.on("chat message", (msg) => {
      console.log("message received", msg);
      io.emit("chat message", msg); // Reenviarlo a todos
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

export default chatSocket;
