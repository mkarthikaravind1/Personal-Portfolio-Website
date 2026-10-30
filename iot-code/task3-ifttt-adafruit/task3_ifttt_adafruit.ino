// Task 3 — IFTTT + Adafruit IO IoT Automation
// IFTTT applets write "ON" / "OFF" into the Adafruit IO feed "bulb" when a
// trigger fires (Google Assistant voice command from the phone). The ESP32
// is subscribed to that feed over MQTT, so the command reaches the relay
// without the ESP32 ever being exposed to the internet.
//
// The firmware side is the Task 2 subscriber plus: tolerant command parsing
// (IFTTT sends free text), a source log, and an automatic Wi-Fi/MQTT recovery
// path that was needed while testing under different conditions.
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

Adafruit_MQTT_Subscribe bulbFeed   = Adafruit_MQTT_Subscribe(&mqtt, AIO_USERNAME "/feeds/bulb");
Adafruit_MQTT_Publish   statusFeed = Adafruit_MQTT_Publish(&mqtt, AIO_USERNAME "/feeds/bulb-status");

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
// few spellings instead of only an exact "ON" / "OFF".
int parseCommand(String v) {
  v.trim();
  v.toUpperCase();
  if (v == "ON"  || v == "1" || v == "TRUE"  || v.indexOf("TURN ON")  >= 0) return 1;
  if (v == "OFF" || v == "0" || v == "FALSE" || v.indexOf("TURN OFF") >= 0) return 0;
  return -1;
}

void setBulb(bool on) {
  if (on == bulbOn) {
    Serial.println("Bulb already " + String(on ? "ON" : "OFF") + " - ignoring");
    return;
  }
  bulbOn = on;
  digitalWrite(RELAY_PIN, on ? RELAY_ON : RELAY_OFF);
  statusFeed.publish(on ? "ON" : "OFF");
  Serial.println(on ? "IFTTT trigger -> Bulb ON" : "IFTTT trigger -> Bulb OFF");
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, RELAY_OFF);

  connectWiFi();
  mqtt.subscribe(&bulbFeed);
}

void loop() {
  connectWiFi();   // recovers if the hotspot drops
  connectMQTT();

  Adafruit_MQTT_Subscribe* sub;
  while ((sub = mqtt.readSubscription(2000))) {
    if (sub == &bulbFeed) {
      String value = (char*)bulbFeed.lastread;
      Serial.println("Feed 'bulb' received: " + value);
      int cmd = parseCommand(value);
      if (cmd == -1) Serial.println("Unknown command - ignored");
      else setBulb(cmd == 1);
    }
  }

  if (!mqtt.ping()) mqtt.disconnect();
}
