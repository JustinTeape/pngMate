
# Minimal Flask backend for Electron/React app
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/hello')
def hello():
    return jsonify({'message': 'Hello from Python!'})

if __name__ == '__main__':
    app.run(port=5000)
