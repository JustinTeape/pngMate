/* eslint-disable no-nested-ternary */
/* eslint-disable react/button-has-type */
// VoiceBotButton.tsx (Modified to fix the TypeScript error)
import { useState } from 'react';
// Import necessary types from React
import type { Dispatch, SetStateAction } from 'react';

const API_URL = 'http://localhost:5000';

interface BotResponse {
  status: string;
  message: string;
  conversation_id?: string;
}

// 🔑 1. DEFINE THE PROPS INTERFACE
interface VoiceBotButtonProps {
  isBotRunning: boolean;
  // This type is the standard way to define a React state setter
  setIsBotRunning: Dispatch<SetStateAction<boolean>>;
}

// 🔑 2. UPDATE THE FUNCTION SIGNATURE TO USE THE INTERFACE
function VoiceBotButton({
  isBotRunning,
  setIsBotRunning,
}: VoiceBotButtonProps) {
  // Local state for loading/message remains
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleToggleBot = async (): Promise<void> => {
    setLoading(true);
    setMessage('');

    const endpoint: string = isBotRunning ? '/stop' : '/start';

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: BotResponse = await response.json();

      if (data.status === 'started') {
        // Use the prop setter
        setIsBotRunning(true);
        setMessage('Bot Started! Speak into your microphone.');
      } else if (data.status === 'ended') {
        // Use the prop setter
        setIsBotRunning(false);
        setMessage('Bot Stopped. Click to restart.');
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Bot control failed:', error);
      setMessage(`Connection Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // The rendering logic below correctly uses the `isBotRunning` prop
  return (
    <button
      onClick={handleToggleBot}
      disabled={loading}
      // Use isBotRunning prop to determine button text and color
      style={{ backgroundColor: isBotRunning ? '#cc0000' : '#00cc00' }}
    >
      {loading
        ? '...'
        : isBotRunning
          ? '🔴 End Conversation'
          : '🟢 Start Voice Bot'}
      {message && (
        <div style={{ fontSize: '0.8em', marginTop: '5px' }}>{message}</div>
      )}
    </button>
  );
}

export default VoiceBotButton;
