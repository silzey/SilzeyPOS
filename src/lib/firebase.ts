
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfr8rC9RvXbEKCIkdoHWl63FmhphyNF-w",
  authDomain: "silzey-pos.firebaseapp.com",
  projectId: "silzey-pos",
  storageBucket: "silzey-pos.firebasestorage.app", // Using the value provided by user
  messagingSenderId: "871677889267",
  appId: "1:871677889267:web:e0b7113a84006a087c0586"
  // measurementId is not present in the new config, which is fine as it's optional.
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

