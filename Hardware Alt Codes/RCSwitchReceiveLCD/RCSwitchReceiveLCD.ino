#include <RCSwitch.h>
#include <LiquidCrystal.h>

LiquidCrystal lcd(12,11,7,6,5,4);
RCSwitch mySwitch = RCSwitch();
int topSpeed;

void setup() {
  Serial.begin(9600);
  pinMode(9,OUTPUT);
  analogWrite(9,120);
  mySwitch.enableReceive(0);  // Receiver on interrupt 0 => that is pin #2
  topSpeed = 0;
  lcd.begin(16, 2);
  lcd.clear();
  pinMode(A0, INPUT);
  pinMode(A1, OUTPUT);
}

void loop() {
  if (mySwitch.available()) {

    Serial.print("Received: ");
    topSpeed = mySwitch.getReceivedValue();
    Serial.println( topSpeed );
    mySwitch.resetAvailable();

    int currSpeed = map(analogRead(A0), 0,1023, 0, 150);
    
    operation(topSpeed, currSpeed);
  }
}

unsigned long previousMillis = 0;
int buzState = LOW; 

void operation(int topSpeed, int currSpeed){
  if(currSpeed>topSpeed){
    //BEEP
    unsigned long currentMillis = millis();

    if (currentMillis - previousMillis >= 300) {
      // save the last time you blinked the LED
      previousMillis = currentMillis;
  
      // if the LED is off turn it on and vice-versa:
      if (buzState == LOW) {
        buzState = HIGH;
      } else {
        buzState = LOW;
      }
  
      // set the LED with the ledState of the variable:
      digitalWrite(A1, buzState);
    }
    else{
      digitalWrite(A1, LOW);
    }
  }
  refreshLCD(topSpeed, currSpeed);
}


void refreshLCD(int topSpeed, int currSpeed){

  lcd.print("TopSpd");
  lcd.setCursor(7,0);
  lcd.write(255);
  lcd.setCursor(7,1);
  lcd.write(255);
  lcd.setCursor(9,0);
  lcd.print("CurrSpd");
  
  String top = String(topSpeed)+"Km/h";
  if(topSpeed<10) top = "00"+top;
  else if (topSpeed<100) top = "0" + top;

  String curr = String(currSpeed)+"Km/h";
  if(currSpeed<10) curr = "00" + curr;
  else if (currSpeed<100) curr = "0" + curr;
  lcd.setCursor(0,1);
  lcd.print(top);
  lcd.setCursor(7,1);
  lcd.write(255);
  lcd.setCursor(8,1);
  lcd.print(" "+curr);
}
