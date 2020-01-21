#include <SoftwareSerial.h>
#include <RH_ASK.h>
#include <SPI.h>
RH_ASK driver;
SoftwareSerial mySerial(2, 3); // RX, TX
void setup() {
  Serial.begin(9600);
  mySerial.begin(115200);
  while (!mySerial)
  {
    ; // wait for serial port to connect.
  }
}

void loop() {
  if (mySerial.available())
  {
    String str=mySerial.readStringUntil('\n');
    char *msg="hello";
//    strcpy(msg,str.c_str());
//    strcpy(msg, str.c_str());
    driver.send((uint8_t *)msg, strlen(msg));
    driver.waitPacketSent();
    Serial.println("Message to be transmitted: "+str);
  }
  delay(500);
}
