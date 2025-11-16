import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCkFuZ739P9vSiNFoJOkupin3SYBvVWtR0",
    authDomain: "meuscarros-c6394.firebaseapp.com",
    projectId: "meuscarros-c6394",
    storageBucket: "meuscarros-c6394.firebasestorage.app",
    messagingSenderId: "1058987868243",
    appId: "1:1058987868243:web:360bf2f4675e76e8c306a6",
    measurementId: "G-NW4WPLXS27"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const storage = getStorage(app)
const db = getFirestore(app)


export { auth, storage, db }