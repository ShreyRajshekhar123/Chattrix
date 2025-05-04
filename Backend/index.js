const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const server = http.createServer(app);

// Setup CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend origin
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// In-memory user storage
let users = {}; // {socketId: username}

// Handle socket events
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("register", (username) => {
    users[socket.id] = username;
    console.log(`📌 Registered: ${username} (${socket.id})`);
  });

  socket.on("send_message", ({ sender, receiver, content }) => {
    console.log(`📨 ${sender} ➡️ ${receiver}: ${content}`);

    // Broadcast to all clients (for simplicity)
    io.emit("receive_message", { sender, receiver, content });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    delete users[socket.id];
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
