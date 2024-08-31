const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");

const Room = require("./models/Room");
const Message = require("./models/Message");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", async ({ room, username }) => {
    const roomDB = await Room.getRoom(parseInt(room));

    if (!roomDB) {
      socket.emit("unauthorized");
      socket.disconnect(true);
      return;
    }

    if (username !== roomDB.username_1 && username !== roomDB.username_2) {
      socket.emit("unauthorized");
      socket.disconnect(true);
      return;
    }

    const messages = await Message.getMessages(room);
    socket.join(room);
    socket.emit("receive_messages", messages);

    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", async (data) => {
    try {
      const { room_id, user_sent, message } = data;
      const newMessage = await Message.createMessage({
        room_id: room_id,
        user_sent,
        message,
      });
      socket.to(room_id).emit("receive_message", newMessage);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

module.exports = server;
