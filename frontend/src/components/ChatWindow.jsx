// import React, { useState, useEffect } from "react";
// import socket from "../utils/Socket";

// const ChatWindow = () => {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [mySocketId, setMySocketId] = useState("");

//   // Replace with dynamic user info from your auth system
//   const senderName = "Shrey";
//   const receiverName = "Alice";

//   useEffect(() => {
//     // Get and store the socket ID
//     socket.on("connect", () => {
//       setMySocketId(socket.id);
//       socket.emit("register", senderName);
//     });

//     // Listen for messages
//     socket.on("receive_message", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => {
//       socket.off("receive_message");
//     };
//   }, [senderName]);

//   const sendMessage = () => {
//     if (text.trim()) {
//       const message = {
//         sender: senderName,
//         receiver: receiverName,
//         content: text,
//         senderSocketId: socket.id, // tag message with sender's socket ID
//       };

//       socket.emit("send_message", message);
//       setText("");
//     }
//   };

//   return (
//     <div className="flex flex-col flex-1 h-full bg-gray-50">
//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((msg) => {
//           const isSender = msg.senderSocketId === mySocketId;

//           return (
//             <div
//               key={
//                 msg.messageId || `${msg.sender}-${msg.content}-${Math.random()}`
//               }
//               className={`flex ${isSender ? "justify-end" : "justify-start"}`}
//             >
//               <div className="flex flex-col items-start">
//                 <div
//                   className={`text-xs font-semibold ${
//                     isSender ? "text-green-500" : "text-gray-500"
//                   }`}
//                 >
//                   {isSender ? "You" : msg.sender}
//                 </div>
//                 <div
//                   className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow-md ${
//                     isSender
//                       ? "bg-green-500 text-white rounded-br-none"
//                       : "bg-gray-200 text-black rounded-bl-none"
//                   }`}
//                 >
//                   <span>{msg.content}</span>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Input Section */}
//       <div className="border-t p-4 flex items-center gap-2 bg-white shadow-md">
//         <input
//           type="text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//           placeholder="Type a message"
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;

import React, { useEffect, useState } from "react";
import socket from "../utils/Socket";

const ChatWindow = ({ username, chattingWith }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [mySocketId, setMySocketId] = useState(null);

  useEffect(() => {
    // Register this user
    socket.emit("register", username);

    // Store own socket ID
    socket.on("your_socket_id", (id) => {
      setMySocketId(id);
    });

    // Listen for incoming messages
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("your_socket_id");
    };
  }, [username]);

  const sendMessage = () => {
    if (text.trim()) {
      socket.emit("send_message", {
        sender: username,
        receiver: chattingWith,
        content: text,
      });
      setText("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isSender = msg.senderSocketId === mySocketId;

          return (
            <div
              key={idx}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div className="flex flex-col items-start">
                <div
                  className={`text-xs font-semibold ${
                    isSender ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {isSender ? "You" : msg.sender}
                </div>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow-md ${
                    isSender
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-white text-black rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2 bg-white shadow">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 rounded-lg border focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
