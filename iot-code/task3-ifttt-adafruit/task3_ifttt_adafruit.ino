// Task 3 — IFTTT + Adafruit IO IoT Automation
// An IFTTT applet writes "1" into the Adafruit IO feed "bulb" when the
// Google Assistant trigger fires ("Okay Google, activate Bulb On"). The ESP32
// is subscribed to that feed over MQTT, so the command reaches the relay
// without the ESP32 ever being exposed to the internet.
//
// It also keeps listening to the Task 2 dashboard feed "relay", so voice and
// dashboard control work side by side. Added on top of Task 2: tolerant
// command parsing (IFTTT sends free text), duplicate filtering, and automatic
// Wi-Fi/MQTT recovery for testing under different conditions.
//
// Library: "Adafruit MQTT Library" (Library Manager)

#include <WiFi.h>
#include "Adafruit_MQTT.h"
#include "Adafruit_MQTT_Client.h"

#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASS "YOUR_WIFI_PASSWORD"

#define AIO_SERVER     "io.adafruit.com"
#define AIO_SERVERPORT 1883
#define AIO_USERNAME   "YOUR_AIO_USERNAME"
#define AIO_KEY        "YOUR_AIO_KEY"

#define RELAY_PIN 23
#define RELAY_ON  HIGH
#define RELAY_OFF LOW

WiFiClient client;
Adafruit_MQTT_Client mqtt(&client, AIO_SERVER, AIO_SERVERPORT, AIO_USERNAME, AIO_KEY);

Adafruit_MQTT_Subscribe bulbFeed  = Adafruit_MQTT_Subscribe(&mqtt, AIO_USERNAME "/feeds/bulb");   // IFTTT
Adafruit_MQTT_Subscribe relayFeed = Adafruit_MQTT_Subscribe(&mqtt, AIO_USERNAME "/feeds/relay");  // dashboard

bool bulbOn = false;

void connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;
  Serial.print("Connecting to Wi-Fi");
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi connected: " + WiFi.localIP().toString());
}

void connectMQTT() {
  if (mqtt.connected()) return;
  Serial.print("Connecting to Adafruit IO... ");
  int8_t ret;
  while ((ret = mqtt.connect()) != 0) {
    Serial.println(mqtt.connectErrorString(ret));
    mqtt.disconnect();
    delay(5000);
  }
  Serial.println("Connected!");
}

// IFTTT passes whatever text the applet was configured with, so accept a
// few spellings instead of only an exact "1" / "0".
int parseCommand(String v) {
  v.trim();
  v.toUpperCase();
  if (v == "ON"  || v == "1" || v == "TRUE"  || v.indexOf("TURN ON")  >= 0) return 1;
  if (v == "OFF" || v == "0" || v == "FALSE" || v.indexOf("TURN OFF") >= 0) return 0;
  return -1;
}

void setBulb(bool on, const char* source) {
  if (on == bulbOn) {
    Serial.println("Bulb already " + String(on ? "ON" : "OFF") + " - ignoring");
    return;
  }
  bulbOn = on;
  digitalWrite(RELAY_PIN, on ? RELAY_ON : RELAY_OFF);
  Serial.printf("%s -> Bulb %s\n", source, on ? "ON" : "OFF");
}

void handle(Adafruit_MQTT_Subscribe* feed, const char* source) {
  String value = (char*)feed->lastread;
  Serial.printf("Feed '%s' received: %s\n", source, value.c_str());
  int cmd = parseCommand(value);
  if (cmd == -1) Serial.println("Unknown command - ignored");
  else setBulb(cmd == 1, source);
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, RELAY_OFF);

  connectWiFi();
  mqtt.subscribe(&bulbFeed);
  mqtt.subscribe(&relayFeed);
}

void loop() {
  connectWiFi();   // recovers if the hotspot drops
  connectMQTT();

  Adafruit_MQTT_Subscribe* sub;
  while ((sub = mqtt.readSubscription(2000))) {
    if (sub == &bulbFeed)  handle(&bulbFeed, "bulb");
    if (sub == &relayFeed) handle(&relayFeed, "relay");
  }

  if (!mqtt.ping()) mqtt.disconnect();
}
