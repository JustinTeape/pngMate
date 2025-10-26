/* eslint-disable @typescript-eslint/no-unused-vars */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'; // Only useState is strictly needed now
import TextBox from '../components/TextBox';
// Removed: icon, idle, speaking, listening imports
import idle from '../../assets/images/idle.jpg';
import listening from '../../assets/images/listening.jpg';
import VoiceBotButton from '../components/VoiceBotButton';

// 1. IMPORT THE NEW HOOK AND TYPES
import { useTranscript } from '../hooks/useTranscript';

import './App.css';

function Hello() {
  // 2. LIFTED STATE: State to track if the bot session is active (controlled by VoiceBotButton)
  const [isBotRunning, setIsBotRunning] = useState<boolean>(false);

  // 3. USE HOOK: Fetch the transcript from the backend every 1000ms (1 second)
  const { transcript, error } = useTranscript(isBotRunning, 1000);

  // 4. FORMAT CONTENT: Convert the array of messages into a single string for the TextBox
  const displayContent: string = transcript
    .map((msg) => `${msg.sender}: ${msg.text}`)
    .join('\n\n');

  // 5. STATUS IMAGE: Toggle between images based on session status
  const statusImage = isBotRunning ? listening : idle;

  return (
    <div className="Hello">
      <div className="floating-group">
        <div className="button-stack">
          <div className="drag-region">
            <img width="200" alt="icon" src={statusImage} />
          </div>
          <div style={{ marginTop: 12 }}>
            {/* 6. PASS PROPS: Provide the state and setter to the VoiceBotButton */}
            <VoiceBotButton
              isBotRunning={isBotRunning}
              setIsBotRunning={setIsBotRunning}
            />
          </div>
        </div>

        {/* 7. DISPLAY TRANSCRIPT: Render the fetched content */}
        <TextBox>
          {error ||
            displayContent ||
            'Click "🟢 Start Voice Bot" to begin your conversation.'}
        </TextBox>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
