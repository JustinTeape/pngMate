import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { app, BrowserWindow } from 'electron';
import icon from '../../assets/icon.svg';
import testImage from '../../assets/images/testImage.jpg';
import DraggableImage from '../components/DraggableImage';
import './App.css';

function Hello() {
  const handleLogoClick = () => {
    console.log('Logo was clicked!');
  };
  return (
    <div>
      <div className="Hello">
        <DraggableImage
          src={testImage}
          alt="Main Logo"
          width={200}
          onClick={handleLogoClick}
        />
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
