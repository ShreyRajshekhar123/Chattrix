import React, { useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);

const App = () => {
  const [user, setUser] = useState(null);
  const [chatWith, setChatWith] = useState("");
  const [isReady, setIsReady] = useState(false);

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      setUser({
        displayName: loggedInUser.displayName,
        email: loggedInUser.email,
        uid: loggedInUser.uid,
      });
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleStartChat = () => {
    if (user && chatWith.trim()) {
      setIsReady(true);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (data) => {
      // console.log(data);
      setUser(data);
    });
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      {!user ? (
        <div className="p-8 bg-white rounded shadow-md space-y-4 text-center">
          <h1 className="text-xl font-semibold">Welcome to Chattrix</h1>
          <button
            onClick={loginHandler}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Sign in with Google
          </button>
        </div>
      ) : !isReady ? (
        <div className="p-8 bg-white rounded shadow-md space-y-4">
          <h1 className="text-xl font-semibold">Hello, {user.displayName}</h1>
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
        <ChatWindow username={user.displayName} chattingWith={chatWith} />
      )}
    </div>
  );
};

export default App;
