function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("Usuario conectado");

    // Escuchar mensaje del cliente
    socket.on("chat message", (msg) => {
      console.log("Mensaje recibido:", msg);
      io.emit("chat message", msg); // Reenviarlo a todos
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado");
    });
  });
}

module.exports = chatSocket
