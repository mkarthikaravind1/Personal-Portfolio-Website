# Task 3 — IFTTT applet configuration

Two applets, one per command. Both write into the same Adafruit IO feed that the ESP32 subscribes to.

## Applet 1 — Bulb ON

| Field | Value |
|---|---|
| **If This** (trigger service) | Google Assistant — *Activate scene* |
| Scene name | `Bulb On` (spoken as "Okay Google, activate Bulb On") |
| **Then That** (action service) | Adafruit — *Send data to Adafruit IO* |
| Feed name | `bulb` |
| Data to save | `ON` |

## Applet 2 — Bulb OFF

| Field | Value |
|---|---|
| **If This** | Google Assistant — *Activate scene* |
| Scene name | `Bulb Off` |
| **Then That** | Adafruit — *Send data to Adafruit IO* |
| Feed name | `bulb` |
| Data to save | `OFF` |

## Connecting the services

1. Sign in to IFTTT and open **Create**.
2. Add the Google Assistant trigger and link the same Google account used on the phone.
3. Add the Adafruit action. IFTTT asks to connect an Adafruit IO account. Approve it so IFTTT can write to your feeds.
4. Select the `bulb` feed and set the value. Save the applet.
5. Repeat for the OFF applet.

## Data path

```
"Okay Google, activate Bulb On"
  → Google Assistant (scene trigger)
  → IFTTT applet
  → Adafruit IO REST API: POST /api/v2/<user>/feeds/bulb/data  {value: "ON"}
  → Adafruit IO MQTT broker publishes on <user>/feeds/bulb
  → ESP32 (subscribed) → GPIO23 → relay → bulb
```
