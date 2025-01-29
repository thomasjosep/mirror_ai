// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhBtjT9DMtjfDGGIpGJxFBAhi1t1qotos",
  authDomain: "workoutapp-73995.firebaseapp.com",
  projectId: "workoutapp-73995",
  storageBucket: "workoutapp-73995.firebasestorage.app",
  messagingSenderId: "446200658809",
  appId: "1:446200658809:web:8aad40d66ea63427fa0da8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


export {db, auth};