// Task 1 — ESP32 Web Server & HTML LED Control
// The ESP32 joins the local Wi-Fi, hosts a web page on port 80, and switches
// the onboard LED when the page's ON / OFF buttons request /on or /off.

#include <WiFi.h>
#include <WebServer.h>

const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

#define LED_PIN 2          // Onboard blue LED on the ESP32 DevKit

WebServer server(80);
bool ledState = false;

// The control page. <meta charset="UTF-8"> is required — without it the
// bulb emoji in the heading renders as garbled characters (see Problems).
const char PAGE[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ESP32 Light Control</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; margin-top: 80px; }
    h1   { margin-bottom: 8px; }
    p    { color: #555; }
    .btn { display: inline-block; width: 120px; padding: 14px 0; margin: 12px;
           font-size: 18px; color: #fff; border: none; border-radius: 6px;
           cursor: pointer; text-decoration: none; }
    .on  { background: #2e8b2e; }
    .off { background: #e53935; }
    #state { margin-top: 20px; font-weight: bold; }
  </style>
</head>
<body>
  <h1>&#128161; ESP32 Light Control</h1>
  <p>Control your ESP32 LED</p>
  <a class="btn on"  href="/on">ON</a>
  <a class="btn off" href="/off">OFF</a>
  <div id="state">LED is %STATE%</div>
</body>
</html>
)rawliteral";

void sendPage() {
  String html = PAGE;
  html.replace("%STATE%", ledState ? "ON" : "OFF");
  server.send(200, "text/html; charset=UTF-8", html);
}

void handleRoot() {
  sendPage();
}

void handleOn() {
  ledState = true;
  digitalWrite(LED_PIN, HIGH);
  Serial.println("Request: /on  -> LED ON");
  sendPage();
}

void handleOff() {
  ledState = false;
  digitalWrite(LED_PIN, LOW);
  Serial.println("Request: /off -> LED OFF");
  sendPage();
}

void handleNotFound() {
  server.send(404, "text/plain", "Not found");
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected. Open http://");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.on("/on", handleOn);
  server.on("/off", handleOff);
  server.onNotFound(handleNotFound);
  server.begin();
  Serial.println("Web server started on port 80");
}

void loop() {
  server.handleClient();
}
