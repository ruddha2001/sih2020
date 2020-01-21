#include <RCSwitch.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
const char* ssid = "Team_Novus";
const char* password = "Te@m_N0vuS";
int speedLimit;

RCSwitch mySwitch = RCSwitch();

void setup() {
  Serial.begin(9600);
  mySwitch.enableTransmit(5);  // Using Pin #D1
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
}

void loop() {
//  mySwitch.send(100, 8);
//  delay(1000);
  if (WiFi.status() == WL_CONNECTED)//Check connection
  {
    HTTPClient http;
    http.begin("http://192.168.225.25:8080/speedlimit?pid=102");
    int httpCode = http.GET();
    if (httpCode > 0)
    {
      speedLimit = http.getString().toInt();
      Serial.printf("OK: %d\n", httpCode);
      Serial.printf("Payload: %d\n",speedLimit);
      mySwitch.send(speedLimit,12);
    }
    else
    {
      Serial.printf("Error Code: %d\n", httpCode);
    }
    http.end();
  }
  delay(500);  
}
