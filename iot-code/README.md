# IoT Tasks 1–5: Source Code

ESP32 firmware and web code for the five ProtoSem IoT tasks. The write-up, wiring diagrams, photos and demo videos are on the portfolio's [IoT Works page](../iot.html).

| Folder | Task | Main files |
|---|---|---|
| `task1-web-server-led/` | ESP32 web server & HTML LED control | `task1_web_server_led.ino` |
| `task2-adafruit-mqtt/` | Adafruit IO dashboard & MQTT | `task2_adafruit_mqtt.ino` |
| `task3-ifttt-adafruit/` | IFTTT + Adafruit IO automation | `task3_ifttt_adafruit.ino`, `ifttt_applets.md` |
| `task4-firebase-dashboard/` | Firebase login + monitoring dashboard | `firmware/`, `web/` (login, dashboard), `firestore.rules`, `firebase.json` |
| `task5-logging-automation/` | DHT11 + LDR, auto/manual mode, Firestore logging (`readings` collection), chart, CSV | `firmware/`, `calibration/`, `web/` |

## Pin map

| Part | ESP32 pin |
|---|---|
| Onboard LED (Task 1) | GPIO2 |
| Relay IN (Tasks 2–5) | GPIO23 |
| DHT11 DATA (Task 5) | GPIO4 (10 kΩ pull-up to 3.3V) |
| LDR module AO (Task 5) | GPIO34 (ADC1, input-only) |

## Arduino libraries

- **Adafruit MQTT Library**: Tasks 2 and 3
- **Firebase Arduino Client Library for ESP8266 and ESP32** (Mobizt): Tasks 4 and 5
- **DHT sensor library** (Adafruit) + **Adafruit Unified Sensor**: Task 5

Board: *ESP32 Dev Module*, Serial Monitor at 115200 baud.

## Before uploading

Replace every `YOUR_…` placeholder (Wi-Fi, Adafruit IO key, Firebase API key, device login). Never commit real keys.

## Web app (Tasks 4–5)

Task 5's `web/` folder has only the files it changes (`dashboard.html`, `js/dashboard.js`). Copy them over Task 4's `web/` folder, then deploy:

```
firebase deploy --only hosting,firestore:rules
```
