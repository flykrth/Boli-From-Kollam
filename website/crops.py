import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
from flask_cors import CORS
load_dotenv()
app = Flask(__name__)
CORS(app)

PEXELS_API_KEY = '71qoSX4GCHf82cLsRm1nvb376xch2uddhimYoho2pUGpYyiSI3x0Fom5'

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
        print(crop_images)
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

        processed_data = {
            'temperature': float(np.mean(weather_data['daily']['temperature_2m_max'][:7])),
            'rainfall': float(np.sum(weather_data['daily']['precipitation_sum'][:7])),
            'humidity': 50
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
    try:
        soil_api_url = "https://api.soilinfo.org/recommendations"

        params = {
            "location": location,
            "crop": crop_name
        }
        
        response = requests.get(soil_api_url, params=params, timeout=10)
        
        if response.status_code == 200:
            soil_data = response.json()
            return {
                "soil_type": soil_data.get("recommended_soil_type", "Loamy soil with good drainage"),
                "preparation": soil_data.get("soil_preparation", "Till the soil well and add organic matter"),
                "watering": soil_data.get("watering_schedule", "Keep soil moist but not waterlogged")
            }
        else:
            print(f"Soil API error: {response.status_code}")
            return get_fallback_soil_recommendations(crop_name)
    
    except Exception as e:
        print(f"Error getting soil recommendations: {str(e)}")
        return get_fallback_soil_recommendations(crop_name)

def get_crop_images(recommendations):
    """Get images for recommended crops with better error handling and fallbacks"""
    crop_images = {}
    
    # Fallback image service (more reliable than placeholder.com)
    fallback_image_service = "https://placehold.co/300x200/png?text="
    
    # Define some known crop images as a fallback (these would be your own hosted images)
    known_crop_images = {
        "Rice": "https://images.unsplash.com/photo-1536054127911-e79d5e13d560?w=300&h=200&fit=crop",
        "Wheat": "https://images.unsplash.com/photo-1574323347407-f5e1c5127681?w=300&h=200&fit=crop",
        "Cotton": "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=300&h=200&fit=crop",
        "Sugarcane": "https://images.unsplash.com/photo-1596473537037-51e0fe9f2585?w=300&h=200&fit=crop",
        "Maize": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&h=200&fit=crop",
    }
    
    for crop in recommendations:
        crop_name = crop["name"]
        
        # First check if we have a known image for this crop
        if crop_name in known_crop_images:
            crop_images[crop_name] = known_crop_images[crop_name]
            continue
            
        # Otherwise try Pexels API if key is available
        if PEXELS_API_KEY:
            search_query = f"{crop_name} crop field"
            url = f"https://api.pexels.com/v1/search?query={search_query}&per_page=1"
            headers = {
                "Authorization": PEXELS_API_KEY
            }
            
            try:
                response = requests.get(url, headers=headers, timeout=5)  # Add timeout
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("photos") and len(data["photos"]) > 0:
                        crop_images[crop_name] = data["photos"][0]["src"]["medium"]
                        continue
            except Exception as e:
                print(f"Error fetching image for {crop_name}: {str(e)}")
        
        # Use fallback if no image was found or if there was an error
        crop_images[crop_name] = f"{fallback_image_service}{crop_name}"
    
    return crop_images

if __name__ == "__main__":
    app.run(debug=True)