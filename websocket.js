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

const userToSocketMap = new Map();
const socketToUserMap = new Map();

io.on("connection", async (socket) => {
  console.log(`User Connected: ${socket.id}`);
  const userId = socket.handshake.query.userId;

  console.log("test");

  console.log(userId);

  if (userId) {
    socketToUserMap.set(socket.id, userId);

    userToSocketMap.set(userId, socket.id);

    console.log(userToSocketMap);
    console.log(socketToUserMap);
    socket.join("online");
  }

  socket.on("join_room", async ({ room, user }) => {
    const roomDB = await Room.getRoom(parseInt(room));

    if (!roomDB) {
      socket.emit("unauthorized");
      socket.disconnect(true);
      return;
    }

    if (user !== roomDB.user_1 && user !== roomDB.user_2) {
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
      const { room_id, user_sent, message, user_receiver } = data;
      console.log(user_receiver, typeof user_receiver);
      const socketId = userToSocketMap.get(user_receiver.toString());
      const newMessage = await Message.createMessage({
        room_id,
        user_sent,
        message,
      });
      socket.to(room_id).emit("receive_message", newMessage);
      console.log("socket", socketId);
      io.to(socketId).emit("pinged", newMessage);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("leave_room", ({ room }) => {
    socket.leave(room);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);

    const userId = socketToUserMap.get(socket.id);

    if (userId) {
      socketToUserMap.delete(socket.id);
      userToSocketMap.delete(userId);
    }
  });
});

module.exports = server;
