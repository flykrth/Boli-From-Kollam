#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>

const char* ssid = "Galaxy M34 5G DD08"; 
const char* password = "qwertyui"; 
const char* serverURL = "http://192.168.175.131:5000/data"; 

#define DHTPIN D4                
#define DHTTYPE DHT11            

DHT dht(DHTPIN, DHTTYPE);

void setup() {
    Serial.begin(115200);
    dht.begin();

    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");
    int attempt = 0;
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
        attempt++;
        if (attempt > 20) { 
            Serial.println("\nFailed to connect to WiFi!");
            return;
        }
    }
    Serial.println("\nConnected to WiFi!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP()); 
}

void loop() {
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    if (isnan(temperature) || isnan(humidity)) {
        Serial.println("Failed to read from DHT sensor!");
    } else {
        Serial.print("Temperature: "); Serial.print(temperature); Serial.println("°C");
        Serial.print("Humidity: "); Serial.print(humidity); Serial.println("%");

        if (WiFi.status() == WL_CONNECTED) {
            WiFiClient client;
            HTTPClient http;
            http.begin(client, serverURL);
            http.addHeader("Content-Type", "application/json");

            String jsonData = "{\"temperature\": " + String(temperature) + 
                              ", \"humidity\": " + String(humidity) + "}";

            int httpResponseCode = http.POST(jsonData);

            if (httpResponseCode > 0) {
                Serial.print("Server Response: ");
                Serial.println(httpResponseCode);
            } else {
                Serial.print("Error Sending Data: ");
                Serial.println(http.errorToString(httpResponseCode).c_str());
            }

            http.end();
        } else {
            Serial.println("WiFi Disconnected! Reconnecting...");
            WiFi.begin(ssid, password);
        }
    }

    Serial.println("------------------------");
    delay(5000);
}
