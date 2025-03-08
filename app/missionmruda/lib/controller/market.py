from flask import Flask, jsonify
import random

app = Flask(__name__)

# Mock cultivation scores for cities (Higher score = Better for cultivation)
CULTIVATION_SCORES = {
    "Thiruvananthapuram": random.uniform(50, 100),
    "Kollam": random.uniform(50, 100),
    "Kochi": random.uniform(50, 100),
    "Thrissur": random.uniform(50, 100),
    "Palakkad": random.uniform(50, 100),
}

# API to fetch cultivation rankings
@app.route("/cultivation-rankings", methods=["GET"])
def get_cultivation_rankings():
    sorted_cities = sorted(
        CULTIVATION_SCORES.items(), key=lambda x: x[1], reverse=True
    )
    return jsonify({"rankings": [{ "city": city, "score": score } for city, score in sorted_cities]})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
