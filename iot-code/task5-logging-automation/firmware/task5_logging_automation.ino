// Task 5 — Firebase Logging, Automation & Data Export (device side)
//
//  DHT11 (GPIO4)  --> temperature, humidity
//  LDR   (GPIO34) --> ambient light (12-bit ADC, LOWER value = DARKER)
//  Relay (GPIO23) --> bulb
//
// Every 2 s : read control/device (mode, bulbState, threshold) and apply it
// Every 5 s : update sensors/current with the latest readings
// Every 30 s: append a timestamped entry to the logs collection
//
// Automatic mode uses hysteresis around the dashboard threshold:
//   LDR < threshold - 50  -> dark   -> bulb ON
//   LDR > threshold + 50  -> bright -> bulb OFF
//   in between            -> keep the current state (no flicker)
//
// Libraries: "Firebase Arduino Client Library for ESP8266 and ESP32" (Mobizt),
//            "DHT sensor library" (Adafruit)

#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include <DHT.h>
#include <time.h>

#define WIFI_SSID     "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

#define API_KEY             "YOUR_FIREBASE_WEB_API_KEY"
#define FIREBASE_PROJECT_ID "iot-dashboard-karthik"
#define DEVICE_EMAIL        "device@your-domain.com"
#define DEVICE_PASSWORD     "YOUR_DEVICE_PASSWORD"

#define DHT_PIN   4
#define DHT_TYPE  DHT11
#define LDR_PIN   34      // ADC1 input-only pin (ADC2 is unusable while Wi-Fi is on)
#define RELAY_PIN 23

#define HYSTERESIS 50

const unsigned long CONTROL_MS = 2000;
const unsigned long SENSOR_MS  = 5000;
const unsigned long LOG_MS     = 30000;

DHT dht(DHT_PIN, DHT_TYPE);
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Values mirrored from control/device
String mode      = "manual";
bool   manualCmd = false;
int    threshold = 500;

// Live state
bool  bulbState   = false;
float temperature = NAN;
float humidity    = NAN;
int   ldrValue    = 0;

unsigned long lastControl = 0, lastSensor = 0, lastLog = 0;

String isoTimestamp() {
  time_t now;
  time(&now);
  char buf[25];
  strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%SZ", gmtime(&now));
  return String(buf);
}

// Average a few samples so a single noisy ADC read can't flip the bulb
int readLDR() {
  long sum = 0;
  for (int i = 0; i < 10; i++) {
    sum += analogRead(LDR_PIN);
    delay(2);
  }
  return sum / 10;
}

void readSensors() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  if (!isnan(t) && !isnan(h)) {   // DHT11 occasionally returns NaN — keep last good value
    temperature = t;
    humidity = h;
  } else {
    Serial.println("DHT11 read failed - keeping last value");
  }
  ldrValue = readLDR();
}

void setBulb(bool on) {
  bulbState = on;
  digitalWrite(RELAY_PIN, on ? HIGH : LOW);
}

void readControl() {
  if (!Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", "control/device", "")) {
    Serial.println("Control read failed: " + fbdo.errorReason());
    return;
  }
  FirebaseJson json;
  FirebaseJsonData d;
  json.setJsonData(fbdo.payload());

  json.get(d, "fields/mode/stringValue");
  if (d.success) mode = d.stringValue;
  json.get(d, "fields/bulbState/booleanValue");
  if (d.success) manualCmd = d.boolValue;
  json.get(d, "fields/threshold/integerValue");      // Firestore sends integers as strings
  if (d.success) threshold = d.stringValue.toInt();
  else {
    json.get(d, "fields/threshold/doubleValue");
    if (d.success) threshold = (int)d.doubleValue;
  }
}

void applyLogic() {
  int darkLimit = threshold - HYSTERESIS;
  int brightLimit = threshold + HYSTERESIS;

  if (mode == "automatic") {
    Serial.printf("Mode: AUTOMATIC | LDR: %d | darkLimit: %d | brightLimit: %d | Threshold: %d\n",
                  ldrValue, darkLimit, brightLimit, threshold);
    if (ldrValue < darkLimit && !bulbState) {
      setBulb(true);
    } else if (ldrValue > brightLimit && bulbState) {
      setBulb(false);
    }
    Serial.println(bulbState ? "Dark detected → Bulb ON" : "Bright → Bulb OFF");
  } else {
    if (manualCmd != bulbState) setBulb(manualCmd);
    Serial.printf("Mode: MANUAL | Bulb: %s\n", bulbState ? "ON" : "OFF");
  }
}

// Fills the shared field set used by both sensors/current and logs/*
void fillFields(FirebaseJson& c) {
  c.set("fields/temperature/doubleValue", isnan(temperature) ? 0 : temperature);
  c.set("fields/humidity/doubleValue", isnan(humidity) ? 0 : humidity);
  c.set("fields/ldr/integerValue", String(ldrValue));
  c.set("fields/bulbState/booleanValue", bulbState);
  c.set("fields/mode/stringValue", mode);
  c.set("fields/threshold/integerValue", String(threshold));
  c.set("fields/timestamp/timestampValue", isoTimestamp());
}

void updateCurrent() {
  FirebaseJson c;
  fillFields(c);
  if (!Firebase.Firestore.patchDocument(&fbdo, FIREBASE_PROJECT_ID, "", "sensors/current", c.raw(),
                                        "temperature,humidity,ldr,bulbState,mode,threshold,timestamp")) {
    Serial.println("sensors/current write failed: " + fbdo.errorReason());
  }
}

void appendLog() {
  FirebaseJson c;
  fillFields(c);
  time_t now;
  time(&now);
  String path = "logs/" + String((unsigned long)now);   // epoch seconds = sortable, unique per 30 s
  if (Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "", path.c_str(), c.raw())) {
    Serial.println("Logged -> " + path);
  } else {
    Serial.println("Log write failed: " + fbdo.errorReason());
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  setBulb(false);
  analogReadResolution(12);
  dht.begin();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi connected: " + WiFi.localIP().toString());

  configTime(0, 0, "pool.ntp.org", "time.google.com");
  Serial.print("Syncing time");
  while (time(nullptr) < 1700000000) {
    delay(300);
    Serial.print(".");
  }
  Serial.println(" done");

  config.api_key = API_KEY;
  auth.user.email = DEVICE_EMAIL;
  auth.user.password = DEVICE_PASSWORD;
  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if (!Firebase.ready()) return;
  unsigned long now = millis();

  if (now - lastControl >= CONTROL_MS) {
    lastControl = now;
    Serial.println("\nChecking Firebase control...");
    readSensors();
    readControl();
    applyLogic();
  }

  if (now - lastSensor >= SENSOR_MS) {
    lastSensor = now;
    updateCurrent();
  }

  if (now - lastLog >= LOG_MS) {
    lastLog = now;
    appendLog();
  }
}
