import React from "react";

const Message = ({ sender, content }) => {
  const isMe = sender === "Me";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-2 rounded-lg ${isMe ? "bg-green-200" : "bg-gray-200"}`}
      >
        <span>{content}</span>
      </div>
    </div>
  );
};

export default Message;
