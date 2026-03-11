// ─────────────────────────────────────────────
//  GAME CONSTANTS
// ─────────────────────────────────────────────

/** Color assigned to each tile number (index = tile number) */
export const TILE_COLORS = [
  '',          // 0 = empty, no color
  '#FF6B6B',   // 1 - red
  '#FF8E53',   // 2 - orange
  '#FFC107',   // 3 - amber
  '#4CAF50',   // 4 - green
  '#2196F3',   // 5 - blue
  '#9C27B0',   // 6 - purple
  '#00BCD4',   // 7 - cyan
  '#FF5722',   // 8 - deep orange
];

/** Instructions content used by InstructionsPage */
export const INSTRUCTIONS = [
  {
    icon: '🎯',
    title: 'Goal',
    desc: 'Arrange tiles 1–8 in order from left-to-right, top-to-bottom. The empty space must end up in the bottom-right corner.',
  },
  {
    icon: '👆',
    title: 'Moving Tiles',
    desc: 'Click any tile that is directly adjacent (up, down, left, right) to the empty space. It will slide into the gap.',
  },
  {
    icon: '💡',
    title: 'AI Hints',
    desc: 'Press "Get Hint" to reveal the next optimal move. Keep pressing "Next Step" to walk through the entire solution.',
  },
  {
    icon: '⏱',
    title: 'Timer & Moves',
    desc: 'Your elapsed time and total move count are displayed. Challenge yourself to solve it faster with fewer moves!',
  },
  {
    icon: '🏆',
    title: 'Winning',
    desc: 'When all tiles are in the correct position, the puzzle is solved! Your final time and moves will be shown.',
  },
  {
    icon: '🔄',
    title: 'New Game',
    desc: 'Click "New Game" at any time to get a fresh randomly generated puzzle. Every puzzle is guaranteed to be solvable.',
  },
];

/** Features shown on the home page */
export const HOME_FEATURES = [
  '🧠 AI-Powered Hints',
  '⚡ Optimal A* Solver',
  '⏱ Time & Move Tracking',
];
