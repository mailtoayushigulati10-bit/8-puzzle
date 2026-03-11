import React from 'react';
import { PAGES } from '../App';
import { HOME_FEATURES } from '../utils/constants';
import { GOAL_STATE } from '../utils/puzzleUtils';
import MiniBoard from '../components/MiniBoard';
import '../styles/components.css';
import './HomePage.css';

function HomePage({ navigate }) {
  return (
    <div className="page home-page">
      <p className="home-eyebrow">Classic Puzzle</p>

      <h1 className="home-title gradient-text">8-Puzzle</h1>

      <p className="home-subtitle">
        Slide tiles into order — AI hints guide you every step
      </p>

      {/* Preview of the solved state */}
      <MiniBoard board={GOAL_STATE} />

      {/* Action buttons */}
      <div className="home-actions">
        <button
          className="btn btn-primary"
          onClick={() => navigate(PAGES.PLAY)}
        >
          ▶&nbsp; PLAY
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => navigate(PAGES.INSTRUCTIONS)}
        >
          📖&nbsp; Instructions
        </button>
      </div>

      {/* Feature pills */}
      <div className="home-features">
        {HOME_FEATURES.map((f) => (
          <span key={f} className="feature-pill">{f}</span>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
