from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Mapping cities to their latitude & longitude for Open-Meteo API
CITY_COORDINATES = {
    "Thiruvananthapuram": (8.5241, 76.9366),
    "Kochi": (9.9312, 76.2673),
    "Kozhikode": (11.2588, 75.7804),
    "Thrissur": (10.5276, 76.2144),
    "Palakkad": (10.7867, 76.6548),
    "Alappuzha": (9.4981, 76.3388),
    "Wayanad": (11.6854, 76.132),
    "Idukki": (9.8494, 76.9800)
}

@app.route('/match-crops', methods=['POST'])
def match_crops():
    data = request.get_json()
    city = data.get("city")

    if city not in CITY_COORDINATES:
        return jsonify({"error": "Invalid city"}), 400

    lat, lon = CITY_COORDINATES[city]
    
    # Fetch weather data from Open-Meteo
    weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
    response = requests.get(weather_url)
    
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch weather data"}), 500

    weather_data = response.json()
    temp = weather_data["current_weather"]["temperature"]
    
    # Example mapping of temperature to soil conditions
    if temp < 20:
        soil_type = "Loamy Soil"
        climate_type = "Cool & Humid"
        matched_crops = ["Carrot", "Broccoli", "Spinach"]
    elif temp < 30:
        soil_type = "Alluvial Soil"
        climate_type = "Moderate & Moist"
        matched_crops = ["Rice", "Banana", "Coconut"]
    else:
        soil_type = "Laterite Soil"
        climate_type = "Hot & Dry"
        matched_crops = ["Millets", "Groundnut", "Maize"]

    return jsonify({
        "city": city,
        "temperature": temp,
        "soil": soil_type,
        "climate": climate_type,
        "matched_crops": [{"name": crop} for crop in matched_crops]
    })

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5003, debug=True)
