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
      setText(""); // Clear input field after sending
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-gray-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isSender = msg.sender === "Me";
          return (
            <div
              key={idx}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow-md ${
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
      <div className="border-t p-4 flex items-center gap-2 bg-white shadow-md">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
