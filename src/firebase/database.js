import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDH9iT4hgN5DoAMN59bpUNdrsWRfK9YYks",
    authDomain: "manufacturing-app-bedf8.firebaseapp.com",
    projectId: "manufacturing-app-bedf8",
    storageBucket: "manufacturing-app-bedf8.appspot.com",
    messagingSenderId: "804702838485",
    appId: "1:804702838485:web:d3563758e0e18ebc45cc5c"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firebaseAuthentication = firebase.auth();
const firebaseFireStore = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { firebaseAuthentication, firebaseFireStore, timestamp };