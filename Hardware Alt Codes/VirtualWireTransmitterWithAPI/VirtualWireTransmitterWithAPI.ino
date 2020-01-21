#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <VirtualWire.h>

const char* ssid = "Team_Novus";
const char* password = "Te@m_N0vuS";
char speedLimit[3];
void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  vw_set_tx_pin(5);
  vw_set_rx_pin(4);
  vw_setup(2000);
}

void loop() {
  if (WiFi.status() == WL_CONNECTED)//Check connection
  {
    HTTPClient http;
    http.begin("http://192.168.225.25:8080/speedlimit?pid=101");
    int httpCode = http.GET();
    if (httpCode > 0)
    {
      http.getString().toCharArray(speedLimit,3);
      Serial.printf("OK: %d\n", httpCode);
      Serial.printf("Payload: %s\n"+speedLimit);
    }
    else
    {
      Serial.printf("Error Code: %d\n", httpCode);
    }
    http.end();
  }
  vw_send((uint8_t *)msg, 3);
  vw_wait_tx();
  delay(1000);
}
