const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();

const userRoutes = require("./routes/userRoutes"); // Adjust path
const mongoose = require("mongoose");

const app = express(); // Declare app before using it

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/chattrix", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// HTTP server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let users = {}; // { username: socket.id }

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Send own socket ID to client
  socket.emit("your_socket_id", socket.id);

  socket.on("register", (username) => {
    users[username] = socket.id;
    console.log(`📌 Registered: ${username} (${socket.id})`);
  });

  socket.on("send_message", ({ sender, receiver, content }) => {
    console.log(`📨 ${sender} ➡️ ${receiver}: ${content}`);
    const receiverSocketId = users[receiver];

    const msgData = {
      sender,
      receiver,
      content,
      senderSocketId: socket.id,
    };

    // Send to sender
    socket.emit("receive_message", msgData);

    // Send to receiver if connected
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", msgData);
    } else {
      console.log(`⚠️  Receiver ${receiver} not connected`);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    for (const username in users) {
      if (users[username] === socket.id) {
        delete users[username];
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
