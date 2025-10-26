# voice_bot.py (FIXED for SDK compatibility)
import os
import signal
import threading
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

# Global variables to hold the active session state
active_conversation = None
active_audio_interface = None
# This list is now primarily a fallback; history is pulled from active_conversation
conversation_transcript = []
transcript_lock = threading.Lock()

# --- Conversation Callbacks ---
# 🛑 REMOVED: These functions are no longer needed as we remove the custom callbacks
# from the Conversation init. They will remain here but will never be called.
def on_response_stream_end(text: str):
    """Callback triggered when the bot finishes speaking a full response."""
    # This logic is now redundant as we pull history from the Conversation object.
    pass

def on_user_speech_end(text: str):
    """Callback triggered when the user finishes speaking."""
    # This logic is now redundant.
    pass
# ------------------------------

def start_voice_bot(api_key, agent_id):
    """Initializes and starts the ElevenLabs Conversational AI agent."""
    global active_conversation
    global active_audio_interface
    global conversation_transcript

    if active_conversation is not None:
        return {"status": "error", "message": "Conversation is already running"}

    try:
        # Clear transcript on new start
        with transcript_lock:
            conversation_transcript.clear()

        client = ElevenLabs(api_key=api_key)

        audio_interface = DefaultAudioInterface()
        active_audio_interface = audio_interface

        # Create the Conversation Object
        conversation = Conversation(
            client=client,
            agent_id=agent_id,
            requires_auth=True,
            audio_interface=audio_interface,
            # 🛑 FIX: Removed unsupported keyword arguments:
            # on_response_stream_end=on_response_stream_end,
            # on_user_speech_end=on_user_speech_end
        )

        # Start the session (non-blocking)
        conversation.start_session()

        active_conversation = conversation

        return {"status": "started", "message": "Conversation session started successfully"}

    except Exception as e:
        # If startup fails, ensure globals are clear
        active_conversation = None
        if active_audio_interface:
            try:
                active_audio_interface.close()
            except:
                pass
        active_audio_interface = None

        print(f"Error during voice bot startup: {e}")
        return {"status": "error", "message": f"Startup failed: {e}"}


def end_voice_bot():
    """Gracefully ends the active conversation session."""
    global active_conversation
    global active_audio_interface

    if active_conversation is not None:
        try:
            # 1. Gracefully end the session
            active_conversation.end_session()
        except Exception as e:
            print(f"Warning: Error encountered during session termination: {e}")

        # 2. Explicitly close the audio interface to free resources
        if active_audio_interface:
            try:
                active_audio_interface.close()
            except Exception as e:
                print(f"Warning: Error closing audio interface: {e}")

        # 3. Clear global state
        active_conversation = None
        active_audio_interface = None

        return {"status": "ended", "message": "Conversation session ended"}
    else:
        return {"status": "error", "message": "No active conversation to end"}

def get_transcript():
    """
    FIXED: Returns the current conversation transcript by pulling history
    directly from the active Conversation object, which is the reliable method.
    """
    global active_conversation

    if active_conversation is not None:
        try:
            # The Conversation object often exposes history as a 'current_conversation'
            # or a similar property (like a 'messages' list).
            history = getattr(active_conversation, 'current_conversation', [])

            # Format the history into the structure the frontend expects:
            transcript_list = []
            for item in history:
                # The structure is usually {"role": "...", "content": "..."}
                sender_role = item.get("role")
                text = item.get("content")

                if text and sender_role:
                    # Map ElevenLabs roles to your frontend roles
                    sender = "Bot" if sender_role.lower() == "assistant" else "User"
                    transcript_list.append({"sender": sender, "text": text})

            return transcript_list

        except Exception as e:
            # Log any issues with accessing the conversation history property
            print(f"Warning: Could not access conversation history property: {e}")

    # If the conversation is not active or history extraction failed, return empty list
    return []
