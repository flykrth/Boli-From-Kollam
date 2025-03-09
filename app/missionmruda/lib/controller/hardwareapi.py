from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Store the latest sensor data
sensor_data = {
    "temperature": None,
    "humidity": None
}

# POST route to receive data from NodeMCU
@app.route('/data', methods=['POST'])
def receive_data():
    global sensor_data
    data = request.json  # Get JSON data from request
    sensor_data["temperature"] = data.get("temperature")
    sensor_data["humidity"] = data.get("humidity")

    print(f"Received: {sensor_data}")  # Debugging
    return jsonify({"message": "Data received successfully"}), 200

# GET route for Flutter to fetch the latest data
@app.route('/data', methods=['GET'])
def send_data():
    return jsonify(sensor_data), 200

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004, debug=True)