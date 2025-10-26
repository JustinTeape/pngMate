# voice_bot.py - FULL REPLACEMENT CODE (FINAL STABLE VERSION)
import os
import threading
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

# Global variables to hold the active session state
active_conversation: Conversation | None = None
active_audio_interface = None

# CRITICAL: This list will now store the transcript, populated by callbacks.
conversation_transcript = []
transcript_lock = threading.Lock()

# --- Conversation Callbacks (REQUIRED to populate transcript) ---

def log_user_transcript(text: str):
    """Callback triggered when the user finishes speaking."""
    with transcript_lock:
        # User message received: Add to the transcript
        conversation_transcript.append({"sender": "User", "text": text})
        print(f"Transcript Logged - User: {text}")

def log_bot_response(text: str):
    """Callback triggered when the bot finishes speaking a full response."""
    with transcript_lock:
        # Bot response finished: Add to the transcript
        conversation_transcript.append({"sender": "Bot", "text": text})
        print(f"Transcript Logged - Bot: {text}")

# ---------------------------------------------------------------------------------

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

        # 🛑 FINAL FIX: Pass callbacks and settings DIRECTLY to the Conversation constructor.
        # This bypasses the broken internal Pydantic configuration logic.
        conversation = Conversation(
            client=client,
            agent_id=agent_id,
            requires_auth=True,
            audio_interface=audio_interface,

            # Pass logging functions directly as callbacks (CRITICAL)
            callback_user_transcript=log_user_transcript,
            callback_agent_response=log_bot_response,
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
            active_conversation.end_session()
        except Exception as e:
            print(f"Warning: Error encountered during session termination: {e}")

        if active_audio_interface:
            try:
                # Use a general exception handler to prevent crash on missing .close()
                active_audio_interface.close()
            except Exception:
                 pass

        active_conversation = None
        active_audio_interface = None

        return {"status": "ended", "message": "Conversation session ended"}
    else:
        return {"status": "error", "message": "No active conversation to end"}

def get_transcript():
    """
    Returns the current conversation transcript by returning the globally
    populated 'conversation_transcript' list.
    """
    global conversation_transcript

    # The list is protected by the lock when being written to by callbacks
    return conversation_transcript
