import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import DraggableImage from '../components/DraggableImage';
import idle from '../../assets/images/idle.jpg';
import speaking from '../../assets/images/speaking.jpg';
import listening from '../../assets/images/listening.jpg';

import './App.css';

function Hello() {
  const handleLogoClick = () => {
    console.log('Logo clicked!');
  };

  return (
    <div className="drag-region">
      <div className="Hello">
        <img
          src={idle}
          alt="Main Logo"
          width={200}
          onClick={handleLogoClick}
          className="no-drag"
        />
        <button type="button" className="no-drag">
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
