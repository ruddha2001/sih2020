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
    uint8_t buf[RH_ASK_MAX_MESSAGE_LEN];
    uint8_t buflen = sizeof(buf);
    if (driver.recv(buf, &buflen)) // Checking message with Buffer Length
    {
        int i;
        // Message with a good checksum received, dumping it in the Serial Console
        driver.printBuffer("Got:", buf, buflen);
    }
}
