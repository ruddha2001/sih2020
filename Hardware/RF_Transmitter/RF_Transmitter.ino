#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <RH_ASK.h>
#ifdef RH_HAVE_HARDWARE_SPI
#include <SPI.h>
#endif
ESP8266WiFiMulti nodeMCU;
RH_ASK driver(2000, 4, 5, 0); // ESP8266 RX Pin, TX Pin, PTT Pin
const char* ssid = "Team_Novus";
const char* password = "Te@m_N0vuS";
String speedLimit;

void setup()
{
  WiFi.mode(WIFI_STA);
#ifdef RH_HAVE_SERIAL
  Serial.begin(9600);
#endif
  if (!driver.init())
#ifdef RH_HAVE_SERIAL
    Serial.println("init failed");
#else
    ;
#endif
  nodeMCU.addAP(ssid, password);
  while (nodeMCU.run() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
}

void loop()
{
  WiFiClient client;
  HTTPClient http;
  if (nodeMCU.run() == WL_CONNECTED)//Check connection
  {

    if (http.begin(client, "http://192.168.225.25:9000/speedlimit?postid=101"))
    {
      int httpCode = http.GET();
      if (httpCode == HTTP_CODE_OK)
      {
        speedLimit = http.getString();
        Serial.printf("OK: %d\n", httpCode);
      }
      else
      {
        Serial.printf("Error Code: %d\n", httpCode);
      }
      http.end();
    }
  }
  char *message = "";
  strcpy(message, speedLimit.c_str());
  driver.send((uint8_t *)message, strlen(message));
  Serial.printf("Message Sent: %s\n", message);
  //  driver.waitPacketSent();
  http.end();
  delay(5000);
}
