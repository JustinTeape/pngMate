import os
import signal
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

from dotenv import load_dotenv
load_dotenv()

# Access variables
API_KEY = os.getenv("API_KEY")
AGENT_ID = os.getenv("AGENT_ID")

def run_voice_bot():
    """Initializes and runs the ElevenLabs Conversational AI agent."""
    
    # 1. Initialize the ElevenLabs Client
    # This client will handle all API calls for the conversation.
    client = ElevenLabs(api_key=API_KEY)

    # 2. Configure the Audio Interface
    # DefaultAudioInterface uses your system's default microphone and speaker.
    audio_interface = DefaultAudioInterface()
    
    # 3. Create the Conversation Object
    # This object manages the real-time two-way audio stream (STT and TTS).
    print("Initializing Financial Voice Bot...")
    conversation = Conversation(
        client=client,
        agent_id=AGENT_ID,
        requires_auth=True, # Set to True as you are providing an API Key
        audio_interface=audio_interface,
        
        # Optional: Add callbacks to print what the user and agent are saying
        callback_agent_response=lambda response: print(f"Agent (Text): {response}"),
        callback_user_transcript=lambda transcript: print(f"User (Transcript): {transcript}"),
    )

    # 4. Graceful Shutdown (allows ending the session by pressing Ctrl+C)
    def end_session_handler(sig, frame):
        print("\nEnding conversation session...")
        conversation.end_session()
    signal.signal(signal.SIGINT, end_session_handler)

    try:
        print("\n--- Session Started ---")
        print("Speak to your bot now (or press Ctrl+C to end)...")
        
        # Start the real-time session
        conversation.start_session()
        
        # Wait for the session to end
        conversation_id = conversation.wait_for_session_end()
        print(f"Conversation ID: {conversation_id}")
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        print("--- Session Ended ---")

if __name__ == "__main__":
    run_voice_bot()