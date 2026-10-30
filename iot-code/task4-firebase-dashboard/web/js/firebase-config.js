// Shared Firebase setup for every page of the dashboard.
// The web config is not a secret — access is controlled by Firebase
// Authentication and the Firestore security rules (see firestore.rules).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_WEB_API_KEY",
  authDomain: "iot-dashboard-karthik.firebaseapp.com",
  projectId: "iot-dashboard-karthik",
  storageBucket: "iot-dashboard-karthik.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
