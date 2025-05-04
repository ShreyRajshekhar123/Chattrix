// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBML5KNlJ5FD2fXSlH4P41K51W9dC5Yl1I",
  authDomain: "new-chattrix.firebaseapp.com",
  projectId: "new-chattrix",
  storageBucket: "new-chattrix.firebasestorage.app",
  messagingSenderId: "546711107933",
  appId: "1:546711107933:web:d9a92485dc3be6d3ced0b4",
  measurementId: "G-9N0Q188HLW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
