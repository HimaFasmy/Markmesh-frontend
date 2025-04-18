// Import the functions 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products 
// https://firebase.google.com/docs/web/setup#available-libraries

// Web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7vyFKnet7rcYVqEckz46BhVELwrdP27w",
  authDomain: "wmark-2ff19.firebaseapp.com",
  projectId: "wmark-2ff19",
  storageBucket: "wmark-2ff19.appspot.com",
  messagingSenderId: "316871967122",
  appId: "1:316871967122:web:16265396719b71adbd414b",
  measurementId: "G-YQ92E11Y4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Export auth 
export { auth };