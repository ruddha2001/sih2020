#include <RCSwitch.h>

RCSwitch mySwitch = RCSwitch();

void setup() {
  mySwitch.enableTransmit(5);  // Using Pin #D1
}

void loop() {
  mySwitch.send(100, 8);
  delay(1000);  
}
