// Task 4 — Firebase IoT Monitoring Dashboard (device side)
// The ESP32 signs in to Firebase as a device user, polls the Firestore
// document control/device for the bulb command written by the web
// dashboard, drives the relay, and reports the real state back to
// sensors/current so the dashboard can show it.
//
// Library: "Firebase Arduino Client Library for ESP8266 and ESP32" (Mobizt)

#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include <time.h>

#define WIFI_SSID     "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

#define API_KEY             "YOUR_FIREBASE_WEB_API_KEY"
#define FIREBASE_PROJECT_ID "iot-dashboard-karthik"

// A Firebase Authentication user created only for the ESP32, so the
// Firestore rules can require request.auth for every read and write.
#define DEVICE_EMAIL    "device@your-domain.com"
#define DEVICE_PASSWORD "YOUR_DEVICE_PASSWORD"

#define RELAY_PIN 23

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

bool bulbState = false;
unsigned long lastPoll = 0;
const unsigned long POLL_MS = 2000;

String isoTimestamp() {
  time_t now;
  time(&now);
  char buf[25];
  strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%SZ", gmtime(&now));
  return String(buf);
}

// Reads control/device -> bulbState written by the dashboard
bool readCommand(bool& cmd) {
  if (!Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", "control/device", "")) {
    Serial.println("Read failed: " + fbdo.errorReason());
    return false;
  }
  FirebaseJson json;
  FirebaseJsonData data;
  json.setJsonData(fbdo.payload());
  json.get(data, "fields/bulbState/booleanValue");
  if (!data.success) return false;
  cmd = data.boolValue;
  return true;
}

// Writes the confirmed relay state to sensors/current
void reportState() {
  FirebaseJson content;
  content.set("fields/bulbState/booleanValue", bulbState);
  content.set("fields/timestamp/timestampValue", isoTimestamp());
  if (!Firebase.Firestore.patchDocument(&fbdo, FIREBASE_PROJECT_ID, "", "sensors/current",
                                        content.raw(), "bulbState,timestamp")) {
    Serial.println("Write failed: " + fbdo.errorReason());
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi connected: " + WiFi.localIP().toString());

  // NTP time is needed for timestamps and for the auth token's expiry check
  configTime(0, 0, "pool.ntp.org", "time.google.com");

  config.api_key = API_KEY;
  auth.user.email = DEVICE_EMAIL;
  auth.user.password = DEVICE_PASSWORD;
  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if (!Firebase.ready() || millis() - lastPoll < POLL_MS) return;
  lastPoll = millis();

  Serial.println("Checking Firebase control...");
  bool cmd;
  if (readCommand(cmd) && cmd != bulbState) {
    bulbState = cmd;
    digitalWrite(RELAY_PIN, bulbState ? HIGH : LOW);
    Serial.println(bulbState ? "Bulb command: ON" : "Bulb command: OFF");
    reportState();
  }
}
