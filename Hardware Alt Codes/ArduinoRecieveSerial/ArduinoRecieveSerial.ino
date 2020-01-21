#include <SoftwareSerial.h>
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
    Serial.println(str);
  }
//  Serial.write("Not Available");
  delay(500);
}
