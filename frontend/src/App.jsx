import React, { useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
} from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);

const App = () => {
  const [user, setUser] = useState(null);
  const [chatWith, setChatWith] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [authMode, setAuthMode] = useState("selection"); // 'google' | 'phone' | 'selection'
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && !u.phoneNumber && authMode === "google") {
        setShowPhonePrompt(true); // Google users need phone number
      }
    });
  }, [authMode]);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      setUser(loggedInUser);
      if (!loggedInUser.phoneNumber) {
        setShowPhonePrompt(true);
      }
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  const configureRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => sendOtp(),
        }
      );
    }
  };

  const sendOtp = async () => {
    configureRecaptcha();
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      setConfirmationResult(result);
      alert("OTP sent!");
    } catch (error) {
      console.error("SMS not sent", error);
    }
  };

  const verifyOtp = async () => {
    try {
      if (confirmationResult) {
        const result = await confirmationResult.confirm(otp);
        setUser(result.user);
      }
    } catch (err) {
      console.error("Invalid OTP", err);
    }
  };

  const savePhoneNumberForGoogleUser = async () => {
    if (user && phoneNumber.trim()) {
      try {
        await updateProfile(user, { phoneNumber }); // This doesn't actually store phoneNumber, workaround below
        // Store it temporarily in displayName if needed
        await updateProfile(user, {
          displayName: `${user.displayName} (${phoneNumber})`,
        });
        setShowPhonePrompt(false);
      } catch (err) {
        console.error("Failed to update profile with phone number", err);
      }
    }
  };

  const handleStartChat = () => {
    if (user && chatWith.trim()) {
      setIsReady(true);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      {authMode === "selection" ? (
        <div className="p-8 bg-white rounded shadow-md space-y-4 text-center">
          <h1 className="text-xl font-semibold">Welcome to Chattrix</h1>
          <button
            onClick={() => setAuthMode("google")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => setAuthMode("phone")}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
          >
            Sign in with Phone Number
          </button>
        </div>
      ) : !user ? (
        authMode === "google" ? (
          <div className="p-8 bg-white rounded shadow-md space-y-4 text-center">
            <h1 className="text-xl font-semibold">Google Sign-In</h1>
            <button
              onClick={loginWithGoogle}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Sign in with Google
            </button>
            <button
              onClick={() => setAuthMode("selection")}
              className="text-sm text-gray-500 mt-2 underline"
            >
              Back
            </button>
          </div>
        ) : (
          <div className="p-8 bg-white rounded shadow-md space-y-4 text-center">
            <h1 className="text-xl font-semibold">Phone Number Sign-In</h1>
            {!confirmationResult ? (
              <>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                />
                <button
                  onClick={sendOtp}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                />
                <button
                  onClick={verifyOtp}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
                >
                  Verify OTP
                </button>
              </>
            )}
            <button
              onClick={() => setAuthMode("selection")}
              className="text-sm text-gray-500 mt-2 underline"
            >
              Back
            </button>
            <div id="recaptcha-container"></div>
          </div>
        )
      ) : showPhonePrompt ? (
        <div className="p-8 bg-white rounded shadow-md space-y-4 text-center">
          <h2 className="text-lg font-medium">
            Enter your phone number to continue
          </h2>
          <input
            type="tel"
            placeholder="+91 9876543210"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <button
            onClick={savePhoneNumberForGoogleUser}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Save and Continue
          </button>
        </div>
      ) : !isReady ? (
        <div className="p-8 bg-white rounded shadow-md space-y-4">
          <h1 className="text-xl font-semibold">
            Hello, {user.displayName || user.phoneNumber}
          </h1>
          <input
            placeholder="Chat with (username or phone)"
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
        <ChatWindow
          username={user.displayName || user.phoneNumber}
          chattingWith={chatWith}
        />
      )}
    </div>
  );
};

export default App;
