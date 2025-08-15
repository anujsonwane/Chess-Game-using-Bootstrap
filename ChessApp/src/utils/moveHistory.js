// Utility functions for chess move notation and history

// Converts board coordinates to algebraic notation (e.g., [6,4] => 'e2')
export function coordsToNotation([row, col]) {
  const files = 'abcdefgh';
  const ranks = '87654321';
  return files[col] + ranks[row];
}

// Generates move notation (e.g., 'e2e4', 'Nf3', 'exd5')
export function getMoveNotation({ piece, from, to, capture = false }) {
  const pieceLetter = piece[1] === 'P' ? '' : piece[1];
  const fromNotation = coordsToNotation(from);
  const toNotation = coordsToNotation(to);
  return (
    (pieceLetter ? pieceLetter : '') +
    (capture ? 'x' : '') +
    toNotation
  );
}

// Adds a move to history
export function addMoveToHistory(history, move) {
  return [...history, move];
}

// Example move object:
// {
//   piece: 'wN',
//   from: [7, 1],
//   to: [5, 2],
//   capture: false,
//   notation: 'Nc3',
//   time: 1.2 // seconds
// }
