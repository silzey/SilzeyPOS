
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfr8rC9RvXbEKCIkdoHWl63FmhphyNF-w",
  authDomain: "silzey-pos.firebaseapp.com",
  projectId: "silzey-pos",
  storageBucket: "silzey-pos.firebasestorage.app",
  messagingSenderId: "871677889267",
  appId: "1:871677889267:web:1f73535e03f96b077c0586"
};

// Initialize Firebase
// Note: The previous version checked if an app already exists (`!getApps().length ? initializeApp(...) : getApp()`).
// The simpler `initializeApp(firebaseConfig)` is used here as per your snippet.
// This might lead to "Firebase app already exists" warnings in development with Next.js Hot Module Replacement.
// If you see such warnings, we can revert to the previous check.
const app = initializeApp(firebaseConfig);

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
