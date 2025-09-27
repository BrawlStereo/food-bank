import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAF2dgakSjkPncrccb-jUmG6S-PUN9NU3Q",
  authDomain: "food-bank-firebase.firebaseapp.com",
  projectId: "food-bank-firebase",
  storageBucket: "food-bank-firebase.appspot.com",
  messagingSenderId: "1026348863959",
  appId: "1:1026348863959:android:f80aa759be7d8f9518bb92",
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
