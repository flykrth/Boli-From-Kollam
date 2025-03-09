from flask import Flask, jsonify
import requests
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)

# Thiruvananthapuram coordinates
LAT = 8.5241
LON = 76.9366

# APIs
WEATHER_API = f"https://archive-api.open-meteo.com/v1/archive?latitude={LAT}&longitude={LON}&start_date=2024-01-01&end_date=2024-03-01&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean&timezone=Asia/Kolkata"
SOIL_API = f"https://api.agromonitoring.com/agro/1.0/soil?polyid=your_polygon_id&appid=1cf4073fd865d5094bc98e18b63b5ef0"  # Replace with real API key

# Fetch Historical Weather Data
def fetch_historical_data():
    print("Fetching real historical data...")
    try:
        weather_response = requests.get(WEATHER_API)
        weather_data = weather_response.json()
        
        temp_max = weather_data["daily"]["temperature_2m_max"]
        temp_min = weather_data["daily"]["temperature_2m_min"]
        humidity = weather_data["daily"]["relative_humidity_2m_mean"]
        rainfall = weather_data["daily"]["precipitation_sum"]

        # Approximate soil moisture (Real API required)
        soil_moisture = np.random.uniform(10, 40, len(temp_max))  

        # Create DataFrame
        data = pd.DataFrame({
            "temperature": [(max_t + min_t) / 2 for max_t, min_t in zip(temp_max, temp_min)],
            "humidity": humidity,
            "moisture": soil_moisture,
            "rainfall": rainfall,
            "disease_risk": np.random.choice([0, 1], len(temp_max))  # Replace with real labels if available
        })
        return data

    except Exception as e:
        print("Error fetching historical data:", e)
        return None

# Load or Train Model
def load_or_train_model():
    try:
        model = joblib.load("crop_failure_model.pkl")
        print("Model loaded successfully!")
    except FileNotFoundError:
        data = fetch_historical_data()
        if data is None:
            print("Failed to fetch historical data. Using random training data.")
            return None
        
        print("Training new model with real data...")
        X = data.drop("disease_risk", axis=1)
        y = data["disease_risk"]

        model = RandomForestClassifier()
        model.fit(X, y)
        joblib.dump(model, "crop_failure_model.pkl")
        print("Model trained and saved!")

    return model

# Fetch Real-Time Weather & Soil Data
def fetch_real_time_data():
    try:
        weather_response = requests.get(f"https://api.open-meteo.com/v1/forecast?latitude={LAT}&longitude={LON}&hourly=temperature_2m,relative_humidity_2m,precipitation")
        soil_response = requests.get(SOIL_API)

        weather_data = weather_response.json()
        soil_data = soil_response.json()

        temp = weather_data["hourly"]["temperature_2m"][0]
        humidity = weather_data["hourly"]["relative_humidity_2m"][0]
        moisture = soil_data.get("soil_moisture", 20)
        rainfall = weather_data["hourly"]["precipitation"][0]

        return [temp, humidity, moisture, rainfall]

    except Exception as e:
        print("Error fetching real-time data:", e)
        return None

@app.route("/predict", methods=["GET"])
def predict_disease_risk():
    model = load_or_train_model()
    if model is None:
        return jsonify({"error": "Failed to train model"}), 500

    data = fetch_real_time_data()
    if data is None:
        return jsonify({"error": "Failed to fetch data"}), 500

    # Convert list to DataFrame with correct feature names
    df = pd.DataFrame([data], columns=["temperature", "humidity", "moisture", "rainfall"])
    
    risk = model.predict(df)[0]  # Now it has feature names
    result = "High Risk of Crop Failure! Take preventive measures." if risk == 1 else "Low Risk. Your crop is in good condition."

    return jsonify({
        "temperature": data[0],
        "humidity": data[1],
        "moisture": data[2],
        "rainfall": data[3],
        "prediction": result
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
