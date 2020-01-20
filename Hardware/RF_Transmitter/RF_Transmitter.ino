#include <RH_ASK.h>
#ifdef RH_HAVE_HARDWARE_SPI
#include <SPI.h>
#endif
RH_ASK driver(2000, 4, 5, 0); // ESP8266 RX Pin, TX Pin, PTT Pin

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
}

void loop()
{
    const char *msg = "isitworking?"; //Max 27 characters
    driver.send((uint8_t *)msg, strlen(msg));
    driver.waitPacketSent();
    delay(200);
}
