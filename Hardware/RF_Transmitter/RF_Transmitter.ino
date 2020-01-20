#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <RH_ASK.h>
#ifdef RH_HAVE_HARDWARE_SPI
#include <SPI.h>
#endif
RH_ASK driver(2000, 4, 5, 0); // ESP8266 RX Pin, TX Pin, PTT Pin
const char* ssid = "Team_Novus";
const char* password = "Te@m_N0vuS";

void setup()
{
#ifdef RH_HAVE_SERIAL
  Serial.begin(9600);
#endif
  if (!driver.init())
#ifdef RH_HAVE_SERIAL
    Serial.println("init failed");
#else
    ;
#endif
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print("Connecting to WiFi..");
  }
}

void loop()
{
  char *msg = "NOTworking!"; //Max 27 characters
  if (WiFi.status() == WL_CONNECTED)//Check connection
  {
    HTTPClient http;
    http.begin("http://192.168.225.25:9000/speedlimit?postid=101");
    int httpCode = http.GET();
    if (httpCode > 0)
    {
      String payload = http.getString();
      strcpy(msg,payload.c_str());
      Serial.printf("OK: %d\n",httpCode);
    }
    else
    {
      Serial.printf("Error Code: %s\n",httpCode);
    }
    http.end();
  }
  driver.send((uint8_t *)msg, strlen(msg));
  Serial.printf("Message Sent: %s\n",msg);
  driver.waitPacketSent();
  delay(200);
}
