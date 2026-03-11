import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import PlayPage from './pages/PlayPage';
import InstructionsPage from './pages/InstructionsPage';
import './styles/global.css';

// Page names as constants to avoid typos
export const PAGES = {
  HOME: 'home',
  PLAY: 'play',
  INSTRUCTIONS: 'instructions',
};

function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.HOME);

  const navigate = (page) => setCurrentPage(page);

  return (
    <div className="app-wrapper">
      {/* Animated background blobs */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      {currentPage === PAGES.HOME && (
        <HomePage navigate={navigate} />
      )}
      {currentPage === PAGES.PLAY && (
        <PlayPage navigate={navigate} />
      )}
      {currentPage === PAGES.INSTRUCTIONS && (
        <InstructionsPage navigate={navigate} />
      )}
    </div>
  );
}

export default App;
