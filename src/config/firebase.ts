// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNI3cKQZroprhijj1WY4vaFuZfbu0cjCg",
  authDomain: "tinxy-website.firebaseapp.com",
  projectId: "tinxy-website",
  storageBucket: "tinxy-website.appspot.com",
  messagingSenderId: "96251686093",
  appId: "1:96251686093:web:f6bfd9119ede1aaad1cd84",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
