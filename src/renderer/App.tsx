import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { app, BrowserWindow } from 'electron';
import icon from '../../assets/icon.svg';
import idle from '../../assets/images/idle.jpg';
import speaking from '../../assets/images/speaking.jpg';
import listening from '../../assets/images/listening.jpg';

import './App.css';

function Hello() {
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={idle} />
      </div>
      <div className="Hello">
        <button type="button">
          Listen
        </button>
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
