// Dashboard: protected page. Listens to sensors/current in real time and
// writes the bulb command to control/device, which the ESP32 polls.
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, onSnapshot, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = (id) => document.getElementById(id);
const controlRef = doc(db, "control", "device");
const sensorRef = doc(db, "sensors", "current");
let bulbState = false;

// Route guard: no user -> back to login
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  console.log("Logged in user:", user.email);
  $("userEmail").textContent = user.email;
  startListeners();
});

function startListeners() {
  // Live readings + the bulb state the ESP32 confirmed
  onSnapshot(sensorRef, (snap) => {
    if (!snap.exists()) return;
    const d = snap.data();
    if (d.temperature !== undefined) $("temp").textContent = `${d.temperature} °C`;
    if (d.humidity !== undefined) $("hum").textContent = `${d.humidity} %`;
    if (d.ldr !== undefined) $("ldr").textContent = d.ldr;
    $("bulbStatus").textContent = d.bulbState ? "ON" : "OFF";
    if (d.timestamp) $("lastUpdate").textContent = "Last update: " + d.timestamp.toDate().toLocaleString();
  });

  // The command currently stored in Firestore drives the button label
  onSnapshot(controlRef, (snap) => {
    if (!snap.exists()) return;
    bulbState = !!snap.data().bulbState;
    $("bulbBtn").textContent = bulbState ? "Turn OFF" : "Turn ON";
  });
}

$("bulbBtn").addEventListener("click", async () => {
  const next = !bulbState;
  console.log("Bulb command:", next);
  await setDoc(controlRef, { bulbState: next, updatedAt: serverTimestamp() }, { merge: true });
});

$("logoutBtn").addEventListener("click", () => signOut(auth));
