import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";

const App = () => {
  const [username, setUsername] = useState("");
  const [chatWith, setChatWith] = useState("");

  const [isReady, setIsReady] = useState(false);

  const handleStartChat = () => {
    if (username.trim() && chatWith.trim()) {
      setIsReady(true);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      {!isReady ? (
        <div className="p-8 bg-white rounded shadow-md space-y-4">
          <h1 className="text-xl font-semibold">Start Chat</h1>
          <input
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            placeholder="Chat with (username)"
            value={chatWith}
            onChange={(e) => setChatWith(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <button
            onClick={handleStartChat}
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            Enter Chat
          </button>
        </div>
      ) : (
        <ChatWindow username={username} chattingWith={chatWith} />
      )}
    </div>
  );
};

export default App;
