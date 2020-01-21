#include <RCSwitch.h>

RCSwitch mySwitch = RCSwitch();
int speedLimit;

void setup() {
  Serial.begin(9600);
  mySwitch.enableReceive(0);  // Receiver on interrupt 0 => that is pin #2
  speedLimit = 0;
}

void loop() {
  if (mySwitch.available()) {

    Serial.print("Received: ");
    speedLimit = mySwitch.getReceivedValue();
    Serial.println( speedLimit );
    mySwitch.resetAvailable();
    operation(speedLimit);
  }
}
void operation(int limit)
{
}
