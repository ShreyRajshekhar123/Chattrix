// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const { Server } = require("socket.io");
// const dotenv = require("dotenv");
// dotenv.config();

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // frontend origin
//     methods: ["GET", "POST"],
//   },
// });

// app.use(cors());
// app.use(express.json());

// // Store multiple sockets per user
// let users = {}; // { username: [socketId1, socketId2, ...] }

// io.on("connection", (socket) => {
//   console.log("✅ User connected:", socket.id);

//   // Register user
//   socket.on("register", (username) => {
//     if (!users[username]) {
//       users[username] = [];
//     }
//     if (!users[username].includes(socket.id)) {
//       users[username].push(socket.id);
//     }
//     console.log(`📌 Registered: ${username} (${socket.id})`);
//   });

//   // Handle sending messages
//   socket.on("send_message", ({ sender, receiver, content }) => {
//     console.log(`📨 ${sender} ➡️ ${receiver}: ${content}`);

//     const message = {
//       sender,
//       receiver,
//       content,
//       senderSocketId: socket.id, // add sender ID for UI detection
//     };

//     // Send to sender
//     socket.emit("receive_message", message);

//     // Send to receiver(s)
//     if (users[receiver]) {
//       users[receiver].forEach((id) => {
//         io.to(id).emit("receive_message", message);
//       });
//     }
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//     for (const username in users) {
//       users[username] = users[username].filter((id) => id !== socket.id);
//       if (users[username].length === 0) {
//         delete users[username];
//       }
//     }
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

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
