
#include <Wire.h>
#include <L3G4200D.h>

L3G4200D gyroscope;

unsigned long timer = 0;
float timeStep = 0.01;
float yaw = 0;

const int stepBR = 30; 
const int dirBR = 31;
const int stepFR = 32;
const int dirFR = 33;
const int stepFL = 34;
const int dirFL = 35;
const int stepBL = 36;
const int dirBL = 37;

const int stepHead = 38;
const int dirHead = 39;

int del = 1000;
String SerialState = "";
bool stopMovement = true;
bool stopHead = true;
bool resetHead = false;

float headAngle = 0;
int headDirection = 0; //0 is left, 1 is right

void getTFminiData(int* distance, int* strength) {
  static char i = 0;
  char j = 0;
  int checksum = 0; 
  static int rx[9];
  if(Serial2.available()) {  
    rx[i] = Serial2.read();
    if(rx[0] != 0x59) {
      i = 0;
    } else if(i == 1 && rx[1] != 0x59) {
      i = 0;
    } else if(i == 8) {
      for(j = 0; j < 8; j++) {
        checksum += rx[j];
      }
      if(rx[8] == (checksum % 256)) {
        *distance = rx[2] + rx[3] * 256;
        *strength = rx[4] + rx[5] * 256;
      }
      i = 0;
    } else {
      i++;
    } 
  }  
}

void resetHeadFunc() {
  digitalWrite(dirHead, HIGH);
    for(int i = 0; i < 3400; i++) {
      digitalWrite(stepHead, HIGH);
      delayMicroseconds(400);
      digitalWrite(stepHead, LOW);
      delayMicroseconds(400);
    }
    headAngle = 0;
    resetHead = false;
}

void setup() {
  pinMode(stepBR,OUTPUT); 
  pinMode(dirBR,OUTPUT);
  
  pinMode(stepFR,OUTPUT); 
  pinMode(dirFR,OUTPUT);
  
  pinMode(stepFL,OUTPUT); 
  pinMode(dirFL,OUTPUT);

  pinMode(stepBL,OUTPUT); 
  pinMode(dirBL,OUTPUT);

  pinMode(stepHead,OUTPUT); 
  pinMode(dirHead,OUTPUT);
  
  digitalWrite(dirBR, HIGH);
  digitalWrite(dirFR, HIGH);
  digitalWrite(dirFL, LOW);
  digitalWrite(dirBL, LOW);
  digitalWrite(dirHead, HIGH);

  Serial.begin(9600); //Bluetooth communication
  Serial2.begin(115200); //TFMini Plus Lidar communication

  while(!gyroscope.begin(L3G4200D_SCALE_2000DPS, L3G4200D_DATARATE_400HZ_50)) {
    Serial.println("Could not find a valid L3G4200D sensor, check wiring!");
    delay(500);
  }

  gyroscope.calibrate(100);

  resetHeadFunc();
}

int headDelay = 0;

void loop() {
  timer = millis();
  int distance = 0;
  int strength = 0;
  if(Serial.available() > 0) {
      SerialState = Serial.readString();
      SerialState.trim();
      if(SerialState == "UP") {
          stopMovement = false;
          digitalWrite(dirBR, LOW);
          digitalWrite(dirFR, LOW);
          digitalWrite(dirFL, HIGH);
          digitalWrite(dirBL, HIGH);
      }
      if (SerialState == "DOWN") {
          stopMovement = false;
          digitalWrite(dirBR, HIGH);
          digitalWrite(dirFR, HIGH);
          digitalWrite(dirFL, LOW);
          digitalWrite(dirBL, LOW);
      }
      if (SerialState == "RIGHT") {
          stopMovement = false;
          digitalWrite(dirBR, HIGH);
          digitalWrite(dirFR, HIGH);
          digitalWrite(dirFL, HIGH);
          digitalWrite(dirBL, HIGH);
      }
      if (SerialState == "LEFT") {
          stopMovement = false;
          digitalWrite(dirBR, LOW);
          digitalWrite(dirFR, LOW);
          digitalWrite(dirFL, LOW);
          digitalWrite(dirBL, LOW);
      }
      if (SerialState == "STOP") {
          stopMovement = true;
          stopHead = true;
      }
      if(SerialState == "HEAD_LEFT") {
          digitalWrite(dirHead, LOW);
          headDirection = 0;
          stopHead = false;
      }
      if(SerialState == "HEAD_RIGHT") {
          digitalWrite(dirHead, HIGH);
          headDirection = 1;
          stopHead = false;
      }
      if(SerialState == "RESET") {
        resetHead = true;
      }
  }
  if(!stopMovement) {
    if(SerialState == "RIGHT" || SerialState == "LEFT") {
        digitalWrite(stepBR,HIGH);
      digitalWrite(stepFR,HIGH);
      digitalWrite(stepFL,HIGH);
      digitalWrite(stepBL,HIGH);
      delayMicroseconds(del); 
      digitalWrite(stepBR,LOW); 
      digitalWrite(stepFR,LOW); 
      digitalWrite(stepFL,LOW); 
      digitalWrite(stepBL,LOW); 
      delayMicroseconds(del);
      
      
//      Vector norm = gyroscope.readNormalize();
//      if(norm.ZAxis * timeStep > 0.015 || norm.ZAxis * timeStep < -0.015) {
//        yaw = yaw + norm.ZAxis * timeStep;
//      }
      Serial.println(yaw);
    } else {
      digitalWrite(stepBR,HIGH);
      digitalWrite(stepFR,HIGH);
      digitalWrite(stepFL,HIGH);
      digitalWrite(stepBL,HIGH);
      delayMicroseconds(del); 
      digitalWrite(stepBR,LOW); 
      digitalWrite(stepFR,LOW); 
      digitalWrite(stepFL,LOW); 
      digitalWrite(stepBL,LOW); 
      delayMicroseconds(del);
    }
  }
  if(!stopHead) {
    digitalWrite(stepHead, HIGH);
    delayMicroseconds(3000);
    digitalWrite(stepHead, LOW);
    delayMicroseconds(3000);
    
    if(headDirection == 0) {
        if(headAngle < 360) {
          headAngle += 0.1125; 
        }
        if(headAngle >= 360) {
          headAngle = 360; 
        }
    } else {
          if(headAngle > 0) {
            headAngle -= 0.1125; 
          }
          if(headAngle <= 0) {
            headAngle = 0; 
          }
    }
    if(headDelay >= 10) {
      getTFminiData(&distance, &strength);
      while(!distance) {
        getTFminiData(&distance, &strength);
      }
      Serial.println(String("[") + distance + String(", ") + headAngle + String("]"));
      headDelay = 0;
    } else {
      headDelay++;  
    }
  }
  if(resetHead) {
    resetHeadFunc();
  }
  
}
