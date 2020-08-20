 import firebase from '@firebase/app';

 require('firebase/auth');
 require('firebase/firestore');
 
 
 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyCPmTm39HlMxOsUdKWWNBDZcdMgnpGiz7c",
    authDomain: "leute-chat.firebaseapp.com",
    databaseURL: "https://leute-chat.firebaseio.com",
    projectId: "leute-chat",
    storageBucket: "leute-chat.appspot.com",
    messagingSenderId: "441271272469",
    appId: "1:441271272469:web:0b6c37870ccb04de2b3a1c"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();
const db = firebase.firestore();
export {auth, db}
