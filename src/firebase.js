// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, child, get } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByaRUTXNcNMJyApG0h4xTVUnUZvbS_MFQ",
  authDomain: "fir-auth-orbital.firebaseapp.com",
  databaseURL: "https://fir-auth-orbital-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "fir-auth-orbital",
  storageBucket: "fir-auth-orbital.appspot.com",
  messagingSenderId: "10351853315",
  appId: "1:10351853315:web:ee3872282d4168add27336"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();

export const auth = getAuth(app);
export default app