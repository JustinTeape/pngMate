# app.py (FINAL Working Code)
import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from voice_bot import start_voice_bot, end_voice_bot, get_transcript # All voice bot functions

# Load environment variables from .env file FIRST
load_dotenv()

app = Flask(__name__)
# IMPORTANT: Enable CORS to allow the React frontend to connect.
CORS(app)

# Load environment variables into module-level variables (Kept for debugging)
API_KEY_GLOBAL = os.getenv("API_KEY")
AGENT_ID_GLOBAL = os.getenv("AGENT_ID")

# --- Debugging ---
if not API_KEY_GLOBAL:
    print("\n🚨 ERROR: API_KEY is NOT loaded from .env. Check file path and variable name.")
else:
    print(f"\n✅ SUCCESS: API_KEY loaded (starts with {API_KEY_GLOBAL[:4]}).")
# -----------------

@app.route('/start', methods=['POST'])
def start_bot():
    """Endpoint to initialize and start the voice conversation."""

    # 🔑 FIX for NameError: Re-read environment variables inside the function scope.
    # This guarantees they are defined locally, bypassing the scope issue.
    api_key = os.getenv("API_KEY")
    agent_id = os.getenv("AGENT_ID")

    if not api_key or not agent_id:
        # Return an immediate error if keys are missing
        return jsonify({
            "status": "error",
            "message": "API_KEY or AGENT_ID is missing from environment variables. Check your .env file."
        })

    # Pass the LOCALLY DEFINED variables to the voice bot logic
    result = start_voice_bot(api_key, agent_id)
    return jsonify(result)

@app.route('/stop', methods=['POST'])
def stop_bot():
    """Endpoint to stop the voice conversation."""
    result = end_voice_bot()
    return jsonify(result)

@app.route('/messages', methods=['GET'])
def get_messages():
    """
    Endpoint for the frontend to poll (every 1 second) to fetch the
    current conversation transcript.
    """
    # Get the list of messages from the voice_bot module
    transcript_list = get_transcript()

    # Return the data in the format expected by the frontend hook
    return jsonify({"messages": transcript_list})

if __name__ == '__main__':
    # Run the application
    app.run(host='0.0.0.0', port=5000, debug=True)
