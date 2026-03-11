import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PAGES } from '../App';
import {
  generateSolvableBoard,
  aStarSolve,
  isValidMove,
  applyMove,
  boardsEqual,
  formatTime,
  GOAL_STATE,
} from '../utils/puzzleUtils';
import StatsBar from '../components/StatsBar';
import Board from '../components/Board';
import HintBox from '../components/HintBox';
import GoalReference from '../components/GoalReference';
import WinOverlay from '../components/WinOverlay';
import '../styles/components.css';
import './PlayPage.css';

function PlayPage({ navigate }) {
  // ── Game state ──────────────────────────────
  const [board, setBoard] = useState(() => generateSolvableBoard());
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isSolved, setIsSolved] = useState(false);

  // ── Hint state ───────────────────────────────
  const [hintPath, setHintPath] = useState(null);   // full solution path (array of tile indices)
  const [hintStep, setHintStep] = useState(0);      // which step in the path we're showing
  const [hintLoading, setHintLoading] = useState(false);
  const [activeHintIndex, setActiveHintIndex] = useState(null); // tile index to highlight

  // ── Refs ─────────────────────────────────────
  const timerRef = useRef(null);

  // ── Timer ────────────────────────────────────
  useEffect(() => {
    if (isRunning && !isSolved) {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isSolved]);

  // ── Start a new game ─────────────────────────
  const startNewGame = useCallback(() => {
    const newBoard = generateSolvableBoard();
    setBoard(newBoard);
    setMoves(0);
    setTime(0);
    setIsRunning(true);
    setIsSolved(false);
    setHintPath(null);
    setHintStep(0);
    setActiveHintIndex(null);
  }, []);

  // ── Handle tile click ─────────────────────────
  const handleTileClick = useCallback(
    (tileIndex) => {
      if (isSolved) return;
      if (!isValidMove(board, tileIndex)) return;

      const newBoard = applyMove(board, tileIndex);
      setBoard(newBoard);
      setMoves((m) => m + 1);

      // Clear hint when player makes a move (path may be stale)
      setHintPath(null);
      setHintStep(0);
      setActiveHintIndex(null);

      // Check win condition
      if (boardsEqual(newBoard, GOAL_STATE)) {
        setIsSolved(true);
        setIsRunning(false);
      }
    },
    [board, isSolved]
  );

  // ── Request a hint ────────────────────────────
  const handleGetHint = useCallback(() => {
    if (isSolved || hintLoading) return;
    setHintLoading(true);

    // Run A* in a setTimeout so UI can update ("Thinking..." state)
    setTimeout(() => {
      const path = aStarSolve(board);
      if (path && path.length > 0) {
        setHintPath(path);
        setHintStep(0);
        setActiveHintIndex(path[0]);
      } else if (path !== null && path.length === 0) {
        // Already solved
        setActiveHintIndex('solved');
      } else {
        // Solver failed (shouldn't happen for valid puzzles)
        setActiveHintIndex('error');
      }
      setHintLoading(false);
    }, 80);
  }, [board, isSolved, hintLoading]);

  // ── Advance to next hint step ─────────────────
  const handleNextHintStep = useCallback(() => {
    if (!hintPath) return;
    const next = hintStep + 1;
    if (next < hintPath.length) {
      setHintStep(next);
      setActiveHintIndex(hintPath[next]);
    } else {
      // End of path
      setActiveHintIndex(null);
    }
  }, [hintPath, hintStep]);

  // ── Dismiss hint ─────────────────────────────
  const handleDismissHint = () => {
    setHintPath(null);
    setHintStep(0);
    setActiveHintIndex(null);
  };

  return (
    <div className="page play-page">
      {/* ── Top nav ── */}
      <div className="nav-row">
        <button
          className="btn btn-ghost"
          onClick={() => { setIsRunning(false); navigate(PAGES.HOME); }}
        >
          ← Home
        </button>

        <h2 className="play-title">8-Puzzle</h2>

        <button className="btn btn-ghost" onClick={startNewGame}>
          New 🔄
        </button>
      </div>

      {/* ── Stats: moves / time / hint steps ── */}
      <StatsBar
        moves={moves}
        timeFormatted={formatTime(time)}
        hintInfo={hintPath ? `${hintStep + 1}/${hintPath.length}` : '—'}
      />

      {/* ── Hint box (shown when hint is active) ── */}
      {activeHintIndex !== null && (
        <HintBox
          board={board}
          hintTileIndex={activeHintIndex}
          hintStep={hintStep}
          totalSteps={hintPath ? hintPath.length : 0}
          hasNextStep={hintPath && hintStep < hintPath.length - 1}
          onNext={handleNextHintStep}
          onDismiss={handleDismissHint}
        />
      )}

      {/* ── Puzzle board ── */}
      <Board
        board={board}
        hintTileIndex={activeHintIndex}
        onTileClick={handleTileClick}
      />

      {/* ── Control buttons ── */}
      <div className="play-controls">
        <button
          className="btn btn-hint"
          onClick={handleGetHint}
          disabled={hintLoading || isSolved}
        >
          {hintLoading ? '🤔 Thinking...' : '💡 Get Hint'}
        </button>

        <button className="btn btn-new-game" onClick={startNewGame}>
          🔄 New Game
        </button>
      </div>

      {/* ── Goal reference ── */}
      <GoalReference />

      {/* ── Win overlay (shown when solved) ── */}
      {isSolved && (
        <WinOverlay
          moves={moves}
          timeFormatted={formatTime(time)}
          onPlayAgain={startNewGame}
          onHome={() => navigate(PAGES.HOME)}
        />
      )}
    </div>
  );
}

export default PlayPage;
