#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <SoftwareSerial.h>
const char* ssid = "Team_Novus";
const char* password = "Te@m_N0vuS";
String speedLimit;
SoftwareSerial mySerial(4, 5); // RX, TX
void setup() {
  Serial.begin(9600);
  mySerial.begin(115200);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
}

void loop() {
  if (WiFi.status() == WL_CONNECTED)//Check connection
  {
    HTTPClient http;
    http.begin("http://192.168.225.25:8080/speedlimit?pid=102");
    int httpCode = http.GET();
    if (httpCode > 0)
    {
      speedLimit = http.getString();
      Serial.printf("OK: %d\n", httpCode);
      Serial.println("Payload: "+speedLimit);
      mySerial.print(speedLimit+"\n");
    }
    else
    {
      Serial.printf("Error Code: %d\n", httpCode);
    }
    http.end();
  }
}
