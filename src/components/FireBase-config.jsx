// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5CbGlo0yev7pEyeMP1HaLQTbpmwUuDQg",
  authDomain: "blog-b7857.firebaseapp.com",
  projectId: "blog-b7857",
  storageBucket: "blog-b7857.appspot.com",
  messagingSenderId: "516112668554",
  appId: "1:516112668554:web:ae1861d92ecee81e119a73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db=getFirestore(app);
export const auth=getAuth(app);
export const provider=new GoogleAuthProvider();

