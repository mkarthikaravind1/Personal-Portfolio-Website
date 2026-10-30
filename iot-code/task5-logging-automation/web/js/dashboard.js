// Task 5 dashboard: live readings, manual/automatic mode, LDR threshold,
// history table + chart from the logs collection, and CSV export.
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, collection, query, orderBy, limit,
  onSnapshot, setDoc, getDocs, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = (id) => document.getElementById(id);
const controlRef = doc(db, "control", "device");
const sensorRef = doc(db, "sensors", "current");
const logsQuery = query(collection(db, "logs"), orderBy("timestamp", "desc"), limit(50));

let control = { bulbState: false, mode: "manual", threshold: 500 };
let chart;

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
  onSnapshot(sensorRef, (snap) => {
    if (!snap.exists()) return;
    const d = snap.data();
    $("temp").textContent = `${d.temperature} °C`;
    $("hum").textContent = `${d.humidity} %`;
    $("ldr").textContent = d.ldr;
    $("bulbStatus").textContent = d.bulbState ? "ON" : "OFF";
  });

  onSnapshot(controlRef, (snap) => {
    if (!snap.exists()) return;
    control = { ...control, ...snap.data() };
    renderControl();
  });

  onSnapshot(logsQuery, (snap) => {
    // Newest first from Firestore; oldest first reads better on a chart
    const rows = snap.docs.map((d) => d.data()).filter((r) => r.timestamp).reverse();
    renderTable(rows);
    renderChart(rows);
  });
}

function renderControl() {
  const auto = control.mode === "automatic";
  $("modeLabel").textContent = auto ? "Automatic" : "Manual";
  document.querySelectorAll(".mode-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.mode === control.mode));
  $("bulbBtn").textContent = control.bulbState ? "Turn OFF" : "Turn ON";
  // In automatic mode the LDR owns the bulb, so manual control is locked
  $("bulbBtn").disabled = auto;
  $("bulbHint").textContent = auto
    ? "Automatic mode is on: the LDR controls the bulb."
    : "Control the connected appliance.";
  if (document.activeElement !== $("thresholdInput")) $("thresholdInput").value = control.threshold;
}

const fmt = (ts) => ts.toDate().toLocaleString();

function renderTable(rows) {
  const body = $("historyBody");
  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="6">No historical data available</td></tr>';
    return;
  }
  body.innerHTML = rows.slice().reverse().map((r) => `
    <tr>
      <td>${fmt(r.timestamp)}</td>
      <td>${r.temperature} °C</td>
      <td>${r.humidity} %</td>
      <td>${r.ldr}</td>
      <td>${r.bulbState ? "ON" : "OFF"}</td>
      <td>${r.mode}</td>
    </tr>`).join("");
}

function renderChart(rows) {
  const labels = rows.map((r) => r.timestamp.toDate().toLocaleTimeString());
  const data = {
    labels,
    datasets: [
      { label: "Temperature (°C)", data: rows.map((r) => r.temperature), borderColor: "#dc2626", yAxisID: "y" },
      { label: "Humidity (%)", data: rows.map((r) => r.humidity), borderColor: "#2563eb", yAxisID: "y" },
      { label: "LDR", data: rows.map((r) => r.ldr), borderColor: "#d97706", yAxisID: "y1" }
    ]
  };
  if (chart) {
    chart.data = data;
    chart.update();
    return;
  }
  chart = new Chart($("historyChart"), {
    type: "line",
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      elements: { point: { radius: 2 }, line: { tension: 0.3, borderWidth: 2 } },
      scales: {
        y: { position: "left", title: { display: true, text: "°C / %" } },
        y1: { position: "right", grid: { drawOnChartArea: false }, title: { display: true, text: "LDR (0–4095)" } }
      }
    }
  });
}

async function writeControl(patch) {
  await setDoc(controlRef, { ...patch, updatedAt: serverTimestamp() }, { merge: true });
}

$("bulbBtn").addEventListener("click", () => {
  console.log("Bulb command:", !control.bulbState);
  writeControl({ bulbState: !control.bulbState });
});

document.querySelectorAll(".mode-btn").forEach((b) =>
  b.addEventListener("click", () => writeControl({ mode: b.dataset.mode })));

$("saveThreshold").addEventListener("click", () => {
  const value = parseInt($("thresholdInput").value, 10);
  if (Number.isNaN(value) || value < 0 || value > 4095) {
    alert("Threshold must be between 0 and 4095.");
    return;
  }
  writeControl({ threshold: value });
});

// CSV export: fetches the full log (not just the 50 rows on screen)
$("csvBtn").addEventListener("click", async () => {
  const snap = await getDocs(query(collection(db, "logs"), orderBy("timestamp", "asc")));
  if (snap.empty) {
    alert("No data to export yet.");
    return;
  }
  const header = "Timestamp,Temperature (C),Humidity (%),LDR,Bulb,Mode,Threshold";
  const lines = snap.docs.map((d) => {
    const r = d.data();
    return [
      r.timestamp.toDate().toISOString(),
      r.temperature, r.humidity, r.ldr,
      r.bulbState ? "ON" : "OFF", r.mode, r.threshold
    ].join(",");
  });
  const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `iot-sensor-log-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
});

$("logoutBtn").addEventListener("click", () => signOut(auth));
