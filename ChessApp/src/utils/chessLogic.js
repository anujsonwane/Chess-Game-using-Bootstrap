// Utility to detect if a move is en passant
export function isEnPassantMove(piece, from, to, enPassantTarget) {
  return (
    piece[1] === 'P' &&
    enPassantTarget &&
    to[0] === enPassantTarget[0] &&
    to[1] === enPassantTarget[1]
  );
}
// Chess logic functions

export const BOARD_SIZE = 8;

export const PIECES = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟'
};

export function findKing(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === color + 'K') return [r, c];
    }
  }
  return null;
}

export function isSquareAttacked(board, row, col, attackerColor) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece[0] === attackerColor) {
        const moves = getValidMovesRaw(board, r, c, piece, true);
        if (moves.some(([mr, mc]) => mr === row && mc === col)) return true;
      }
    }
  }
  return false;
}

export function getValidMovesRaw(board, row, col, piece, forAttack = false) {
  const moves = [];
  const color = piece[0] === 'w' ? 'w' : 'b';
  const directions = {
    N: [-2, -1, 1, 2],
    K: [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1], [1, 0], [1, 1]
    ],
    B: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
    R: [[-1, 0], [1, 0], [0, -1], [0, 1]],
    Q: [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]
  };
  const inBoard = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
  const canMove = (r, c) => inBoard(r, c) && (!board[r][c] || board[r][c][0] !== color);
  switch (piece[1]) {
    case 'P': {
      const dir = color === 'w' ? -1 : 1;
      if (!forAttack) {
        if (inBoard(row + dir, col) && !board[row + dir][col]) moves.push([row + dir, col]);
        if ((color === 'w' && row === 6) || (color === 'b' && row === 1)) {
          if (!board[row + dir][col] && !board[row + 2 * dir][col]) moves.push([row + 2 * dir, col]);
        }
      }
      for (let dc of [-1, 1]) {
        const r = row + dir, c = col + dc;
        if (inBoard(r, c) && board[r][c] && board[r][c][0] !== color) moves.push([r, c]);
        if (forAttack && inBoard(r, c)) moves.push([r, c]);
      } 
      break;
    }
    case 'N': {
      for (let dr of directions.N) {
        for (let dc of directions.N) {
          if (Math.abs(dr) !== Math.abs(dc)) {
            const r = row + dr, c = col + dc;
            if (canMove(r, c)) moves.push([r, c]);
          }
        }
      }
      break;
    }
    case 'K': {
      for (let [dr, dc] of directions.K) {
        const r = row + dr, c = col + dc;
        if (canMove(r, c)) moves.push([r, c]);
      }
      break;
    }
    case 'B': {
      for (let [dr, dc] of directions.B) {
        for (let i = 1; i < 8; i++) {
          const r = row + dr * i, c = col + dc * i;
          if (!inBoard(r, c)) break;
          if (!board[r][c]) {
            moves.push([r, c]);
          } else {
            if (board[r][c][0] !== color) moves.push([r, c]);
            break;
          }
        }
      }
      break;
    }
    case 'R': {
      for (let [dr, dc] of directions.R) {
        for (let i = 1; i < 8; i++) {
          const r = row + dr * i, c = col + dc * i;
          if (!inBoard(r, c)) break;
          if (!board[r][c]) {
            moves.push([r, c]);
          } else {
            if (board[r][c][0] !== color) moves.push([r, c]);
            break;
          }
        }
      }
      break;
    }
    case 'Q': {
      for (let [dr, dc] of directions.Q) {
        for (let i = 1; i < 8; i++) {
          const r = row + dr * i, c = col + dc * i;
          if (!inBoard(r, c)) break;
          if (!board[r][c]) {
            moves.push([r, c]);
          } else {
            if (board[r][c][0] !== color) moves.push([r, c]);
            break;
          }
        }
      }
      break;
    }
    default:
      break;
  }
  return moves;
}

export function getPinnedPieces(board, color) {
  const pinned = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece[0] === color && piece[1] !== 'K') {
        const newBoard = board.map(rowArr => rowArr.slice());
        newBoard[r][c] = null;
        const kingPos = findKing(newBoard, color);
        if (isSquareAttacked(newBoard, kingPos[0], kingPos[1], color === 'w' ? 'b' : 'w')) {
          pinned.push(`${r}-${c}`);
        }
      }
    }
  }
  return pinned;
}

export function getValidMoves(board, row, col, piece) {
  const color = piece[0] === 'w' ? 'w' : 'b';
  const movesRaw = getValidMovesRaw(board, row, col, piece);
  // Find king position
  const kingPos = findKing(board, color);
  // Is king in check?
  const inCheck = isSquareAttacked(board, kingPos[0], kingPos[1], color === 'w' ? 'b' : 'w');

  // Pin detection
  let pinLine = null;
  if (piece[1] !== 'K') {
    // Check if piece is between king and an attacker
    const dr = row - kingPos[0];
    const dc = col - kingPos[1];
    // Only consider straight or diagonal lines
    if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
      const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
      const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
      let r = row + stepR, c = col + stepC;
      let foundAttacker = false;
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const attacker = board[r][c];
        if (attacker && attacker[0] !== color) {
          // Check if attacker is a rook, bishop, or queen and can attack along this line
          if ((stepR === 0 || stepC === 0) && (attacker[1] === 'R' || attacker[1] === 'Q')) foundAttacker = true;
          if ((stepR !== 0 && stepC !== 0) && (attacker[1] === 'B' || attacker[1] === 'Q')) foundAttacker = true;
          break;
        } else if (attacker) {
          break;
        }
        r += stepR;
        c += stepC;
      }
      if (foundAttacker) {
        pinLine = [stepR, stepC];
      }
    }
  }

  // If not in check and not pinned, all moves allowed
  if (!inCheck && !pinLine) return movesRaw;

  // If pinned, restrict moves to pin line
  let movesFiltered = movesRaw;
  if (pinLine) {
    movesFiltered = movesRaw.filter(([mr, mc]) => {
      // Move must be along the pin line
      const dr = mr - kingPos[0];
      const dc = mc - kingPos[1];
      return (pinLine[0] === 0 ? dr === 0 : dr / Math.abs(dr) === pinLine[0]) &&
             (pinLine[1] === 0 ? dc === 0 : dc / Math.abs(dc) === pinLine[1]);
    });
  }

  // If in check, only allow moves that resolve check
  if (inCheck) {
    const valid = [];
    for (const [mr, mc] of movesFiltered) {
      // Simulate move
      const newBoard = board.map(rowArr => rowArr.slice());
      newBoard[mr][mc] = board[row][col];
      newBoard[row][col] = null;
      const newKingPos = piece[1] === 'K' ? [mr, mc] : kingPos;
      if (!isSquareAttacked(newBoard, newKingPos[0], newKingPos[1], color === 'w' ? 'b' : 'w')) {
        valid.push([mr, mc]);
      }
    }
    return valid;
  }
  return movesFiltered;
}
