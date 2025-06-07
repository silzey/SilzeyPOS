
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCd9oRRgHKAfR94BWqcA_K02obfX1a4o8g",
  authDomain: "silzeypos.firebaseapp.com",
  projectId: "silzeypos",
  storageBucket: "silzeypos.appspot.com", // Corrected: .firebasestorage.app is typically for direct file access URLs. The config usually has .appspot.com
  messagingSenderId: "843110330842",
  appId: "1:843110330842:web:d8c6cf0636726525e150e3",
  measurementId: "G-1ZYB47G1BC"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Firebase Analytics if supported
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, googleProvider, analytics };
