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
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
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
