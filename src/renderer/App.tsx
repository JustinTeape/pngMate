/* eslint-disable @typescript-eslint/no-unused-vars */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import TextBox from '../components/TextBox';
import icon from '../../assets/icon.svg';
import idle from '../../assets/images/idle.jpg';
import speaking from '../../assets/images/speaking.jpg';
import listening from '../../assets/images/listening.jpg';

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
      /*
      audio testing code
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

        // You would typically call a function here to send the audioBlob to a Speech-to-Text service.

      };
      */

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

  // Cleanup on unmount: stop recorder and revoke any object URL
  useEffect(() => {
    return () => {
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        try {
          recorder.stop();
        } catch {
          /* ignore */
        }
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Hello">
      <div className="floating-group">
        <div className="button-stack">
          <div className="drag-region">
            {isListening ? (
              <img width="200" alt="icon" src={listening} />
            ) : (
              <img width="200" alt="icon" src={idle} />
            )}
          </div>
          <div style={{ marginTop: 12 }}>
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
            >
              {isListening ? 'Stop Recording' : 'Start Listening'}
            </button>
          </div>
        </div>

        <TextBox>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum. It is a long established fact that
          a reader will be distracted by the readable content of a page when
          looking at its layout. The point of using Lorem Ipsum is that it has a
          more-or-less normal distribution of letters, as opposed to using
          'Content here, content here', making it look like readable English.
          Many desktop publishing packages and web page editors now use Lorem
          Ipsum as their default model text, and a search for 'lorem ipsum' will
          uncover many web sites still in their infancy. Various versions have
          evolved over the years, sometimes by accident, sometimes on purpose
          (injected humour and the like).
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
