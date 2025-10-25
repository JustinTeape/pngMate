import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { app, BrowserWindow } from 'electron';
import icon from '../../assets/icon.svg';
import testImage from '../../assets/images/testImage.jpg';
import './App.css';

function Hello() {
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={testImage} />
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
