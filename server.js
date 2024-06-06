require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const verify = require("./middleware/verifyToken");
const profileRoute = require("./routes/profileUpdate");
const signRoute = require("./routes/userSignRoute");
const socketHandler = require("./routes/SocketHandler");

const user = require("./models/user");
const chatRoom = require("./models/chatRoom");
const UserChatRoom = require("./models/userChatRoom");
const Message = require("./models/Message");

const sequelize = require("./utils/db");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust this to your frontend's URL in production
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Bad JSON:", err);
    return res.status(400).json({ message: "Invalid JSON" });
  }
  next();
});

// Routes
app.use("/auth", signRoute);
app.use("/api", verify, profileRoute);

// Socket handler
socketHandler(io);

// Database relations
user.belongsToMany(chatRoom, { through: UserChatRoom });
chatRoom.belongsToMany(user, { through: UserChatRoom });

// WebSocket event handling
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinRoom", async ({ userId, roomId }) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);

    // Fetch and send previous messages in the room
    const messages = await Message.findAll({ where: { roomId } });
    socket.emit("previousMessages", messages);
  });

  socket.on("sendMessage", async ({ userId, roomId, message }) => {
    // Save message to database
    const newMessage = await Message.create({
      userId,
      roomId,
      message,
    });

    // Broadcast message to the room
    io.to(roomId).emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

async function initiate() {
  try {
    await sequelize.sync({ force: false });
    console.log("DB connected");
    server.listen(3001, () => {
      console.log(`Server Running at 3001`);
    });
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
}

initiate();
