/**
   BasicHTTPClient.ino

    Created on: 24.05.2015

*/

#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

#include <RH_ASK.h>
#ifdef RH_HAVE_HARDWARE_SPI
#include <SPI.h> // Not actually used but needed to compile
#endif

ESP8266WiFiMulti WiFiMulti;

RH_ASK driver(2000, 4, 5, A0);

void setup() {

  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP("Team_Novus", "Te@m_N0vuS");

  updateTopSpeed();
}

String SpeedLimit = "0";
unsigned long previousMillis = 0;


void loop() {
  // wait for WiFi connection

  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= 5000) {
    // save the last time TopSpeed was updated
    previousMillis = currentMillis;
    updateTopSpeed();
  }

  broadcastTopSpeed();
}

void broadcastTopSpeed() {
  char *msg = "";
  strcpy(msg, SpeedLimit.c_str());

  driver.send((uint8_t *)msg, strlen(msg));
  //driver.waitPacketSent();
}

void updateTopSpeed() {
  if ((WiFiMulti.run() == WL_CONNECTED)) {

    WiFiClient client;

    HTTPClient http;

    Serial.print("[HTTP] begin...\n");
    if (http.begin(client, "http://192.168.225.25:9000/speedlimit?postid=101")) {  // HTTP


      Serial.print("[HTTP] GET...\n");
      // start connection and send HTTP header
      int httpCode = http.GET();

      // httpCode will be negative on error
      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTP] GET... code: %d\n", httpCode);

        // file found at server
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          SpeedLimit = http.getString();
          Serial.println(SpeedLimit);
        }
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }

      http.end();
    } else {
      Serial.printf("[HTTP} Unable to connect\n");
    }
  }
}
