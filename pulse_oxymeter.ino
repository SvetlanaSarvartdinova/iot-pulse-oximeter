#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include "MAX30100_PulseOximeter.h"

int BPM, SpO2;
PulseOximeter pox;
// MAX30100  SDA SCL
// Arduino   D1  D2

const char* ssid = "Keenetic-3162";       
const char* password = "sfU6MA5R";  

WiFiUDP Udp;
unsigned int UdpPort = 4210;  

void setup()
{
  Serial.begin(115200);
  Serial.println();

  Serial.printf("Connecting to %s ", ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" connected");
  
  Udp.begin(4567);
  BPM = random(55, 220);
  SpO2 = random(20, 100);
}

void loop()
{
  Udp.parsePacket();
//  pox.update();
//  BPM = pox.getHeartRate();
//  SpO2 = pox.getSpO2();
  while (BPM > 220)
    BPM = random(55, 220);
  while (SpO2 > 100)
    SpO2 = random(20, 100);
  BPM = BPM + 10 - random(0, 20);
  SpO2 = SpO2 + 5 - random(0, 10);
  Udp.beginPacket(Udp.remoteIP(), Udp.remotePort());    
  Udp.write(BPM);  
  Udp.write(SpO2);    
  Udp.endPacket();
  delay(1000);
}