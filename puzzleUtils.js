// ─────────────────────────────────────────────
//  PUZZLE UTILITY FUNCTIONS
//  Contains: board generation, validation,
//  move logic, and A* solver
// ─────────────────────────────────────────────

export const GOAL_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0];

/** Convert board array to string key for use in Sets/Maps */
export function boardKey(board) {
  return board.join(',');
}

/** Check if two boards are equal */
export function boardsEqual(a, b) {
  return boardKey(a) === boardKey(b);
}

/** Get the row and column of an index on a 3x3 grid */
export function indexToRowCol(index) {
  return {
    row: Math.floor(index / 3),
    col: index % 3,
  };
}

/**
 * Count inversions to determine if a puzzle is solvable.
 * An inversion is when a higher-numbered tile appears before
 * a lower-numbered tile (ignoring 0).
 */
export function countInversions(board) {
  const flat = board.filter((x) => x !== 0);
  let inversions = 0;
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inversions++;
    }
  }
  return inversions;
}

/** Returns true if the board configuration is solvable */
export function isSolvable(board) {
  return countInversions(board) % 2 === 0;
}

/**
 * Manhattan Distance heuristic:
 * Sum of distances each tile is from its goal position.
 * Used by A* as the admissible heuristic.
 */
export function manhattanDistance(board) {
  let total = 0;
  for (let i = 0; i < 9; i++) {
    const tile = board[i];
    if (tile === 0) continue;
    const goalIndex = tile - 1; // tile 1 belongs at index 0, tile 2 at index 1, etc.
    const current = indexToRowCol(i);
    const goal = indexToRowCol(goalIndex);
    total += Math.abs(current.row - goal.row) + Math.abs(current.col - goal.col);
  }
  return total;
}

/**
 * Get all valid neighbor moves from a given board state.
 * Returns array of { board, movedTileIndex } objects.
 */
export function getNeighbors(board) {
  const zeroIndex = board.indexOf(0);
  const { row: zr, col: zc } = indexToRowCol(zeroIndex);
  const directions = [
    { dr: -1, dc: 0 }, // up
    { dr: 1, dc: 0 },  // down
    { dr: 0, dc: -1 }, // left
    { dr: 0, dc: 1 },  // right
  ];

  const neighbors = [];
  for (const { dr, dc } of directions) {
    const nr = zr + dr;
    const nc = zc + dc;
    if (nr < 0 || nr > 2 || nc < 0 || nc > 2) continue;
    const neighborIndex = nr * 3 + nc;
    const newBoard = [...board];
    [newBoard[zeroIndex], newBoard[neighborIndex]] = [newBoard[neighborIndex], newBoard[zeroIndex]];
    neighbors.push({ board: newBoard, movedTileIndex: neighborIndex });
  }
  return neighbors;
}

/**
 * Check if a tile at `tileIndex` is adjacent to the empty space.
 * Returns true if the move is valid.
 */
export function isValidMove(board, tileIndex) {
  const zeroIndex = board.indexOf(0);
  const { row: zr, col: zc } = indexToRowCol(zeroIndex);
  const { row: tr, col: tc } = indexToRowCol(tileIndex);
  return Math.abs(zr - tr) + Math.abs(zc - tc) === 1;
}

/**
 * Apply a move: swap the tile at tileIndex with the empty space.
 * Returns the new board state.
 */
export function applyMove(board, tileIndex) {
  const zeroIndex = board.indexOf(0);
  const newBoard = [...board];
  [newBoard[zeroIndex], newBoard[tileIndex]] = [newBoard[tileIndex], newBoard[zeroIndex]];
  return newBoard;
}

/**
 * A* Search Algorithm
 * Finds the optimal (shortest) sequence of tile indices to move
 * to reach the GOAL_STATE from the given initial board.
 *
 * Returns: array of tile indices to move (the solution path),
 *          or null if unsolvable / too complex.
 */
export function aStarSolve(initialBoard) {
  // Already solved
  if (boardsEqual(initialBoard, GOAL_STATE)) return [];

  // Priority queue as sorted array: [ { board, g, h, path } ]
  const openList = [
    {
      board: initialBoard,
      g: 0,
      h: manhattanDistance(initialBoard),
      path: [],
    },
  ];

  const visited = new Set();
  let iterations = 0;
  const MAX_ITERATIONS = 100000;

  while (openList.length > 0 && iterations < MAX_ITERATIONS) {
    iterations++;

    // Sort by f = g + h (lowest first)
    openList.sort((a, b) => a.g + a.h - (b.g + b.h));
    const current = openList.shift();

    const key = boardKey(current.board);
    if (visited.has(key)) continue;
    visited.add(key);

    // Goal reached!
    if (boardsEqual(current.board, GOAL_STATE)) {
      return current.path;
    }

    // Expand neighbors
    for (const { board: nextBoard, movedTileIndex } of getNeighbors(current.board)) {
      const nextKey = boardKey(nextBoard);
      if (visited.has(nextKey)) continue;
      openList.push({
        board: nextBoard,
        g: current.g + 1,
        h: manhattanDistance(nextBoard),
        path: [...current.path, movedTileIndex],
      });
    }
  }

  return null; // Could not solve within iteration limit
}

/**
 * Generate a random solvable board.
 * Ensures the puzzle is neither too easy (min 10 moves) nor unsolvable.
 */
export function generateSolvableBoard(minManhattan = 10) {
  const tiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  let board;
  let attempts = 0;
  do {
    board = [...tiles].sort(() => Math.random() - 0.5);
    attempts++;
    if (attempts > 10000) break; // safety exit
  } while (!isSolvable(board) || manhattanDistance(board) < minManhattan);
  return board;
}

/** Format seconds into MM:SS display string */
export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
