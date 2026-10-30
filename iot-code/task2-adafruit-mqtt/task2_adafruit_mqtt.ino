// Task 2 — Adafruit IO Dashboard & MQTT
// The ESP32 subscribes to the Adafruit IO feed "bulb" over MQTT. When the
// dashboard toggle publishes ON / OFF, the broker forwards it here and the
// relay switches the bulb. The new state is published back to "bulb-status".
//
// Library: "Adafruit MQTT Library" (Library Manager)

#include <WiFi.h>
#include "Adafruit_MQTT.h"
#include "Adafruit_MQTT_Client.h"

// ================================================
// Wi-Fi
// ================================================
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASS "YOUR_WIFI_PASSWORD"

// ================================================
// Adafruit IO
// ================================================
#define AIO_SERVER     "io.adafruit.com"
#define AIO_SERVERPORT 1883
#define AIO_USERNAME   "YOUR_AIO_USERNAME"
#define AIO_KEY        "YOUR_AIO_KEY"

// ================================================
// RELAY
// ================================================
#define RELAY_PIN 23

// Relay logic
#define RELAY_ON  HIGH
#define RELAY_OFF LOW

WiFiClient client;
Adafruit_MQTT_Client mqtt(&client, AIO_SERVER, AIO_SERVERPORT, AIO_USERNAME, AIO_KEY);

// Feed topics follow the Adafruit IO format: <username>/feeds/<feed-key>
Adafruit_MQTT_Subscribe bulbFeed   = Adafruit_MQTT_Subscribe(&mqtt, AIO_USERNAME "/feeds/bulb");
Adafruit_MQTT_Publish   statusFeed = Adafruit_MQTT_Publish(&mqtt, AIO_USERNAME "/feeds/bulb-status");

// Connects (or reconnects) to the Adafruit IO broker
void connectMQTT() {
  if (mqtt.connected()) return;

  Serial.print("Connecting to Adafruit IO... ");
  int8_t ret;
  uint8_t retries = 5;
  while ((ret = mqtt.connect()) != 0) {
    Serial.println(mqtt.connectErrorString(ret));
    Serial.println("Retrying in 5 seconds...");
    mqtt.disconnect();
    delay(5000);
    if (--retries == 0) ESP.restart();
  }
  Serial.println("Connected!");
}

void setBulb(bool on) {
  digitalWrite(RELAY_PIN, on ? RELAY_ON : RELAY_OFF);
  statusFeed.publish(on ? "ON" : "OFF");
  Serial.println(on ? "Bulb -> ON" : "Bulb -> OFF");
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, RELAY_OFF);

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi connected: " + WiFi.localIP().toString());

  mqtt.subscribe(&bulbFeed);
}

void loop() {
  connectMQTT();

  // Wait up to 2 s for a message on any subscribed feed
  Adafruit_MQTT_Subscribe* sub;
  while ((sub = mqtt.readSubscription(2000))) {
    if (sub == &bulbFeed) {
      String value = (char*)bulbFeed.lastread;
      value.trim();
      Serial.println("Received from feed 'bulb': " + value);

      if (value == "ON" || value == "1")       setBulb(true);
      else if (value == "OFF" || value == "0") setBulb(false);
    }
  }

  // Keep the connection alive — Adafruit IO drops idle clients
  if (!mqtt.ping()) mqtt.disconnect();
}
