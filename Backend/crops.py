import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from flask import Flask, request, jsonify
import requests
import json
from dotenv import load_dotenv
import openai
from flask_cors import CORS
load_dotenv()
app = Flask(__name__)
CORS(app)

PEXELS_API_KEY = 'APIKEY'

@app.route('/api/recommend', methods=['POST'])
def recommend_plants():
    try:
        data = request.get_json()
        location = data.get('location', '')
        if not location:
            return jsonify({"error": "Location is required"}), 400

        weather_data = get_weather(location)
        if isinstance(weather_data, str) and "Error" in weather_data:
            return jsonify({"error": weather_data}), 400

        recommendations = get_plant_recommendations(weather_data)

        crop_images = get_crop_images(recommendations)
        
        return jsonify({
            "location": location,
            "weather": weather_data,
            "recommended_crops": recommendations,
            "crop_images": crop_images
        })
    
    except Exception as e:
        print(f"Error in recommend_plants: {str(e)}")
        return jsonify({"error": str(e)}), 500

def get_coordinates(city_name):
    """Get latitude and longitude from city name."""
    geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city_name}&count=1&language=en&format=json"
    response = requests.get(geo_url)

    if response.status_code == 200:
        data = response.json()
        if "results" in data and len(data["results"]) > 0:
            lat, lon = data["results"][0]["latitude"], data["results"][0]["longitude"]
            return lat, lon
        else:
            return None, None
    else:
        print(f"Error getting coordinates: {response.status_code} - {response.text}")
        return None, None

def get_weather(city_name):
    latitude, longitude = get_coordinates(city_name)
    if latitude is None or longitude is None:
        return "City not found. Please try again."

    api_url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,shortwave_radiation_sum,wind_speed_10m_max&timezone=Asia/Kolkata"

    print("Requesting:", api_url)
    response = requests.get(api_url)

    if response.status_code == 200:
        weather_data = response.json()
        
        # Extract and process the relevant weather data
        processed_data = {
            'temperature': float(np.mean(weather_data['daily']['temperature_2m_max'][:7])),
            'rainfall': float(np.sum(weather_data['daily']['precipitation_sum'][:7])),
            'humidity': 50  # Default value as this isn't provided by the API
        }
        
        return processed_data
    else:
        return f"Error getting weather data: {response.status_code} - {response.text}"
    
def get_plant_recommendations(weather_data):
    try:
        data_url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRnYyLxWaZXv7VsWecmdFS3c9GE62rqYpXuxPxEf-uxJmBilt78oH1xGmz2EBZBB_QY5BE4Ldsd74Td/pub?output=csv"
        data = pd.read_csv(data_url)
        print("Dataset columns:", data.columns.tolist())
    except Exception as e:
        print(f"Error loading data: {e}")
        return []
    
    feature_cols = ['temperature', 'humidity', 'rainfall']
    
    if not all(col in data.columns for col in feature_cols + ['label']):
        print("Dataset missing required columns!")
        missing_cols = [col for col in feature_cols + ['label'] if col not in data.columns]
        print(f"Missing columns: {missing_cols}")
        return []

    X = data[feature_cols]
    y = data['label']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    scaler.fit(X)
    X_train_std = scaler.transform(X_train)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_std, y_train)

    input_data = np.array([
        weather_data['temperature'],
        weather_data.get('humidity', 50),
        weather_data['rainfall']
    ]).reshape(1, -1)

    input_data_std = scaler.transform(input_data)

    probabilities = model.predict_proba(input_data_std)[0]
    classes = model.classes_

    recommendations = [
        {'name': classes[i], 'confidence': round(probabilities[i] * 100, 1)}
        for i in range(len(classes))
    ]

    recommendations.sort(key=lambda x: x['confidence'], reverse=True)
    return recommendations[:5]

def get_soil_recommendations(location, crop_name):
    """Get soil preparation recommendations for growing a specific crop in a location."""
    # Use a local dataset or API to get recommendations instead of OpenAI
    try:
        # Define base URL for a hypothetical soil API (you would need to replace this with a real API)
        soil_api_url = "https://api.soilinfo.org/recommendations"
        
        # Set up parameters for the request
        params = {
            "location": location,
            "crop": crop_name
        }
        
        # Make the request
        response = requests.get(soil_api_url, params=params, timeout=10)
        
        if response.status_code == 200:
            soil_data = response.json()
        else:
            print(f"Soil API error: {response.status_code}")
            # Fall back to static recommendations based on crop type
            return get_fallback_soil_recommendations(crop_name)
    
    except Exception as e:
        print(f"Error getting soil recommendations: {str(e)}")
        return get_fallback_soil_recommendations(crop_name)

def get_crop_images(recommendations):
    """Get images for recommended crops from Pexels API"""
    crop_images = {}
    
    if not PEXELS_API_KEY:
        # Fallback if no API key
        for crop in recommendations:
            crop_images[crop["name"]] = "https://via.placeholder.com/300x200?text="+crop["name"]
        return crop_images
    
    for crop in recommendations:
        crop_name = crop["name"]
        search_query = f"{crop_name} crop field"
        
        url = f"https://api.pexels.com/v1/search?query={search_query}&per_page=1"
        headers = {
            "Authorization": PEXELS_API_KEY
        }
        
        try:
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data["photos"]:
                    crop_images[crop_name] = data["photos"][0]["src"]["medium"]
                else:
                    crop_images[crop_name] = "https://via.placeholder.com/300x200?text="+crop_name
            else:
                crop_images[crop_name] = "https://via.placeholder.com/300x200?text="+crop_name
                
        except Exception:
            crop_images[crop_name] = "https://via.placeholder.com/300x200?text="+crop_name
    
    return crop_images

if __name__ == "__main__":
    app.run(debug=True)