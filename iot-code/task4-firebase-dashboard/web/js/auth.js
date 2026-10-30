// Login page: email/password sign-in, account creation and Google sign-in.
// On success the user is sent to the dashboard; dashboard.js redirects back
// here if no one is signed in.
import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const form = document.getElementById("authForm");
const errorEl = document.getElementById("error");
const switchLink = document.getElementById("switchLink");
let creating = false;

// Already signed in -> skip the login page
onAuthStateChanged(auth, (user) => {
  if (user) window.location.href = "dashboard.html";
});

// Firebase error codes -> messages a user can act on
function friendlyError(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":   return "Incorrect email or password.";
    case "auth/email-already-in-use": return "An account already exists for this email.";
    case "auth/weak-password":    return "Password must be at least 6 characters.";
    case "auth/too-many-requests": return "Too many attempts. Try again in a few minutes.";
    case "auth/popup-closed-by-user": return "Google sign-in was cancelled.";
    default: return "Something went wrong (" + code + ").";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.textContent = "";
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  try {
    if (creating) await createUserWithEmailAndPassword(auth, email, password);
    else await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    errorEl.textContent = friendlyError(err.code);
  }
});

document.getElementById("googleBtn").addEventListener("click", async () => {
  errorEl.textContent = "";
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (err) {
    errorEl.textContent = friendlyError(err.code);
  }
});

switchLink.addEventListener("click", (e) => {
  e.preventDefault();
  creating = !creating;
  document.getElementById("formTitle").textContent = creating ? "Create Account" : "Welcome Back";
  document.getElementById("formSub").textContent = creating
    ? "Sign up to start monitoring your devices"
    : "Login to access your IoT Dashboard";
  document.getElementById("submitBtn").textContent = creating ? "Sign Up" : "Login";
  document.getElementById("switchText").textContent = creating ? "Already have an account?" : "Don't have an account?";
  switchLink.textContent = creating ? "Login" : "Create Account";
});
