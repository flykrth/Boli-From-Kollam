from flask import Flask, request, jsonify

app = Flask(__name__)

users = {"define": "hackathon", "flykrth": "passwd"}

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username in users and users[username] == password:
        return jsonify({"message": "Login successful", "status": "success"}), 200
    else:
        return jsonify({"message": "Invalid credentials", "status": "fail"}), 401

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
