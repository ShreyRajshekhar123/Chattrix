import React, { useState, useEffect } from "react";

import socket from "../utils/Socket";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (text.trim()) {
      const message = {
        sender: "Me",
        receiver: "Alice",
        content: text,
      };
      socket.emit("send_message", message);
      setMessages((prev) => [...prev, message]);
      setText("");
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => {
          const isSender = msg.sender === "Me"; // Replace "Me" with your dynamic username if needed

          return (
            <div
              key={idx}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  isSender
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                <span>{msg.content}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Section */}
      <div className="border-t p-4 flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring"
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
