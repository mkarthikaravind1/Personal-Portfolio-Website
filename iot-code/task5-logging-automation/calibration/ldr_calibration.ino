// Task 5 — LDR calibration sketch
// Prints the raw LDR value every 250 ms. Record the reading with the room
// lights on, then with the sensor covered / lights off, and pick a
// threshold between the two. That value is entered on the dashboard.

#define LDR_PIN 34

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);   // 0 – 4095
}

void loop() {
  Serial.println(analogRead(LDR_PIN));
  delay(250);
}
