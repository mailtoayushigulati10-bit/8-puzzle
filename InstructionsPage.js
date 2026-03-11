import React from 'react';
import { PAGES } from '../App';
import { INSTRUCTIONS } from '../utils/constants';
import '../styles/components.css';
import './InstructionsPage.css';

function InstructionsPage({ navigate }) {
  return (
    <div className="page instructions-page">
      <div className="instructions-container glass-card">

        {/* Back button */}
        <button
          className="btn btn-ghost"
          style={{ alignSelf: 'flex-start', marginBottom: 24 }}
          onClick={() => navigate(PAGES.HOME)}
        >
          ← Back
        </button>

        <h2 className="instructions-title">📖 How to Play</h2>
        <p className="instructions-sub">Master the 8-Puzzle in minutes</p>

        {/* Instruction items */}
        <div className="instructions-list">
          {INSTRUCTIONS.map(({ icon, title, desc }) => (
            <div key={title} className="instruction-item">
              <span className="instruction-icon">{icon}</span>
              <div>
                <div className="instruction-title">{title}</div>
                <div className="instruction-desc">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* AI tip box */}
        <div className="tip-box">
          <div className="tip-label">💡 DID YOU KNOW?</div>
          <p className="tip-text">
            The AI solver uses the <strong>A* algorithm</strong> with a{' '}
            <strong>Manhattan Distance heuristic</strong> — the same technique used
            in GPS navigation and robotics path planning. It always finds the
            shortest possible solution!
          </p>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 8 }}
          onClick={() => navigate(PAGES.PLAY)}
        >
          ▶&nbsp; Start Playing
        </button>
      </div>
    </div>
  );
}

export default InstructionsPage;
