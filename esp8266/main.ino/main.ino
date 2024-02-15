#include <DHT11.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

const char* ssid = "Georgi's S23 Ultra";  // The SSID (name) of the Wi-Fi network you want to connect to
const char* password = "petar1234";       // The password of the Wi-Fi network
const char* mqttServer = "192.168.100.117";
const int mqttPort = 1883;

DHT11 dht11(2);
WiFiClient espClient;
PubSubClient client(espClient);
int status = WL_IDLE_STATUS;

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {  // Wait for the Wi-Fi to connect
    delay(500);
  }
  Serial.println("Connection established!");
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());  // Send the IP address of the ESP8266 to the computer

  client.setServer(mqttServer, mqttPort);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  getAndSendTemperatureAndHumidityData();
  delay(10000);
}

void reconnect() {
  while (!client.connected()) {
    status = WiFi.status();
    if (status != WL_CONNECTED) {
      WiFi.begin(ssid, password);
      while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
      }
      Serial.println("Connected to WiFi");
    }
    Serial.print("Connecting to Mosquitto broker");
    if (client.connect("Esp8266", NULL, NULL)) {
      Serial.println("[DONE]");
    } else {
      Serial.print("[FAILED] [ rc = ");
      Serial.println(" : retrying in 5 seconds]");
      delay(500);
    }
  }
}

void getAndSendTemperatureAndHumidityData() {
  // int humidity = dht11.readHumidity();
  // delay(50);
  int temperature = dht11.readTemperature();
  if (
    // isnan(humidity) || 
  
  isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  Serial.println("Sending data to Mosquitto broker:");
  // Serial.print("Humidity: ");
  // Serial.print(humidity);
  // Serial.println(" %");
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" *C");

  client.publish("esp/temperature", String(temperature).c_str());
  // client.publish("esp/humidity", String(humidity).c_str());
}

void readTemperatureAndHumidity() {
  // Attempt to read the temperature and humidity values from the DHT11 sensor.
  // int temperature = dht11.readTemperature();

  // If using ESP32 or ESP8266 (xtensa architecture), uncomment the delay below.
  // This ensures stable readings when calling methods consecutively.
  // delay(50);

  // int humidity = dht11.readHumidity();

  // Check the results of the readings.
  // If there are no errors, print the temperature and humidity values.
  // If there are errors, print the appropriate error messages.
  // if (temperature != DHT11::ERROR_TIMEOUT && humidity != DHT11::ERROR_TIMEOUT) {
  // Serial.print("Temperature: ");
  // Serial.print(temperature);
  // Serial.println(" °C");

  // Serial.print("Humidity: ");
  // Serial.print(humidity);
  // Serial.println(" %");
  // } else {
  //   if (temperature == DHT11::ERROR_TIMEOUT || temperature == DHT11::ERROR_CHECKSUM) {
  //     Serial.print("Temperature Reading Error: ");
  //     Serial.println(DHT11::getErrorString(temperature));
  //   }
  //   if (humidity == DHT11::ERROR_TIMEOUT || humidity == DHT11::ERROR_CHECKSUM) {
  //     Serial.print("Humidity Reading Error: ");
  //     Serial.println(DHT11::getErrorString(humidity));
  //   }
  // }


  // Wait for 1 seconds before the next reading.
  // delay(1000);
}
