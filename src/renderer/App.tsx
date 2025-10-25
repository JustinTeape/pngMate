/* eslint-disable @typescript-eslint/no-unused-vars */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useRef, useState } from 'react';
import icon from '../../assets/icon.svg';
import testImage from '../../assets/images/testImage.jpg';
import './App.css';

function Hello() {
  const [isListening, setIsListening] = useState(false);
  // State to hold the URL of the last recorded audio file
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // --- 🎙️ Start Listening ---
  const startListening = async () => {
    try {
      // Clear any previous audio URL when starting a new recording
      setAudioUrl(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      // 4. Set up stop handling (when recording ends)
      mediaRecorder.onstop = () => {
        // This is the key change: process the Blob and create a URL
        const audioBlob: Blob = new Blob(audioChunksRef.current, {
          type: 'audio/wav', // Ensure correct MIME type
        });

        // 🔑 1. Create a playable URL from the Blob
        const url = URL.createObjectURL(audioBlob);

        // 🔑 2. Store the URL in state so the component re-renders with the player
        setAudioUrl(url);

        // Clear chunks for the next recording
        audioChunksRef.current = [];

        console.log(
          'Recording stopped. Audio Blob created and URL generated:',
          url,
        );
        // You would typically call a function here to send the audioBlob to a Speech-to-Text service.
      };

      // 5. Start recording and update state
      mediaRecorder.start();
      setIsListening(true);
      console.log('Listening started...');
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Check permissions.');
    }
  };

  // --- 🛑 Stop Listening ---
  const stopListening = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
      // Stop the mic stream tracks to release the mic
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsListening(false);
      console.log('Listening stopped.');
    }
  };

  // Clean up the URL when the component unmounts (good practice)
  // You might also want to clean it up when a new recording starts, which we do in startListening.
  // Although not strictly necessary for this minimal example, you might add a useEffect for cleanup.

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={testImage} />
      </div>
      <div className="Hello">
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? 'Stop Recording' : 'Start Listening'}
        </button>
      </div>

      {/* 🎧 Audio Player Section */}
      {audioUrl && (
        <div className="Audio-Playback">
          <h3>Playback Test</h3>
          {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
          {/* The <audio> element is native HTML for playing audio */}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio controls src={audioUrl}>
            {/* Your browser does not support the audio element. */}
            <track kind="captions" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      {/* 🎧 End Audio Player Section */}
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
