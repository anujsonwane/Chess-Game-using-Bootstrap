  const handleResign = () => {
    console.log('Resign button clicked. Current turn:', turn, 'Checkmate:', checkmate);
    if (!checkmate) {
      setCheckmate(turn === 'w' ? 'b' : 'w'); // The opponent wins
    }
  };

import React, { useState } from "react";
import { coordsToNotation, getMoveNotation, addMoveToHistory } from "../utils/moveHistory";
import "../App.css";
import { BOARD_SIZE, PIECES, findKing, isSquareAttacked, getValidMovesRaw, getPinnedPieces, getValidMoves as getValidMovesLogic } from "../utils/chessLogic";

const initialBoard = [
  ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
  Array(8).fill('bP'),
  ...Array(4).fill(Array(8).fill(null)),
  Array(8).fill('wP'),
  ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
];

function ChessBoard() {
  const [board, setBoard] = useState(initialBoard.map(row => row.slice()));
  const [selected, setSelected] = useState(null); // {row, col}
  const [validMoves, setValidMoves] = useState([]);
  const [turn, setTurn] = useState('w'); // 'w' for white, 'b' for black
  const [checkmate, setCheckmate] = useState(null); // null or 'w'/'b'
  const [moveHistory, setMoveHistory] = useState([]); // [{piece, from, to, capture, notation, time}]

  // Move validation for all pieces, restricts moves to resolve check and handle pins
  const getValidMoves = (row, col, piece) => {
    return getValidMovesLogic(board, row, col, piece);
  };

  const handleResign = () => {
    console.log('Resign button clicked. Current turn:', turn, 'Checkmate:', checkmate);
    if (!checkmate) {
      setCheckmate(turn === 'w' ? 'b' : 'w'); // The opponent wins
    }
  };

  const handleSquareClick = (row, col) => {
    if (checkmate) return; // No moves after checkmate
    const piece = board[row][col];
    // Only allow selecting your own piece
    if (piece && piece[0] === turn) {
      setSelected({row, col});
      setValidMoves(getValidMoves(row, col, piece));
    } else if (selected) {
      // Check if clicked square is a valid move (empty or opponent)
      if (validMoves.some(([r, c]) => r === row && c === col)) {
        const newBoard = board.map(rowArr => rowArr.slice());
        const from = [selected.row, selected.col];
        const to = [row, col];
        const movingPiece = board[selected.row][selected.col];
        const capture = !!board[row][col];
        newBoard[row][col] = movingPiece;
        newBoard[selected.row][selected.col] = null;
        setBoard(newBoard);
        // Move notation
        const notation = getMoveNotation({ piece: movingPiece, from, to, capture });
        setMoveHistory(prev => addMoveToHistory(prev, {
          piece: movingPiece,
          from,
          to,
          capture,
          notation,
          time: null // You can add timing logic if desired
        }));
        const nextTurn = turn === 'w' ? 'b' : 'w';
        setTurn(nextTurn); // Switch turn after move
        // Check for checkmate after move
        setTimeout(() => {
          const kingPos = findKing(newBoard, nextTurn);
          if (kingPos && isSquareAttacked(newBoard, kingPos[0], kingPos[1], nextTurn === 'w' ? 'b' : 'w')) {
            // Generate all legal moves for next player
            let hasLegalMove = false;
            for (let r = 0; r < 8; r++) {
              for (let c = 0; c < 8; c++) {
                const p = newBoard[r][c];
                if (p && p[0] === nextTurn) {
                  const moves = getValidMovesRaw(newBoard, r, c, p);
                  for (const [mr, mc] of moves) {
                    // Simulate move
                    const testBoard = newBoard.map(rowArr => rowArr.slice());
                    testBoard[mr][mc] = newBoard[r][c];
                    testBoard[r][c] = null;
                    const newKingPos = p[1] === 'K' ? [mr, mc] : kingPos;
                    if (!isSquareAttacked(testBoard, newKingPos[0], newKingPos[1], nextTurn === 'w' ? 'b' : 'w')) {
                      hasLegalMove = true;
                      break;
                    }
                  }
                  if (hasLegalMove) break;
                }
              }
              if (hasLegalMove) break;
            }
            if (!hasLegalMove) {
              setCheckmate(nextTurn);
            }
          }
        }, 0);
      }
      setSelected(null);
      setValidMoves([]);
    }
  };

  const renderSquares = () => {
    const squares = [];
    // Find king position and check status
    const whiteKing = findKing(board, 'w');
    const blackKing = findKing(board, 'b');
    const whiteInCheck = whiteKing && isSquareAttacked(board, whiteKing[0], whiteKing[1], 'b');
    const blackInCheck = blackKing && isSquareAttacked(board, blackKing[0], blackKing[1], 'w');
    const pinnedWhite = getPinnedPieces(board, 'w');
    const pinnedBlack = getPinnedPieces(board, 'b');
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const isDark = (row + col) % 2 === 1;
        const piece = board[row][col];
        const isSelected = selected && selected.row === row && selected.col === col;
        const isValidMove = validMoves.some(([r, c]) => r === row && c === col);
        const isKingInCheck = (piece === 'wK' && whiteInCheck) || (piece === 'bK' && blackInCheck);
        const isPinned = (piece && piece[0] === 'w' && pinnedWhite.includes(`${row}-${col}`)) || (piece && piece[0] === 'b' && pinnedBlack.includes(`${row}-${col}`));
        squares.push(
          <div
            key={`${row}-${col}`}
            className={`chess-square ${isDark ? "dark" : "light"}${isSelected ? " selected" : ""}${isValidMove ? " valid-move" : ""}${isKingInCheck ? " king-check" : ""}${isPinned ? " pinned-piece" : ""}`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2em', cursor: piece || isValidMove ? 'pointer' : 'default' }}
            onClick={() => handleSquareClick(row, col)}
          >
            {piece ? PIECES[piece] : ''}
          </div>
        );
      }
    }
    return squares;
  };

  const handleNewGame = () => {
    setBoard(initialBoard.map(row => row.slice()));
    setSelected(null);
    setValidMoves([]);
    setTurn('w');
    setCheckmate(null);
    setMoveHistory([]);
  };

  return (
    <div className="chess-app-container">
      <header className="chess-title-bar">
        <h1>♚ Chess App</h1>
        <span className="chess-turn">Turn: {turn === 'w' ? 'White' : 'Black'}</span>
      </header>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
        <div className="chess-board-wrapper">
          <div className="chess-board">
            {renderSquares()}
          </div>
        </div>
        <div className="chess-move-history" style={{ marginLeft: '32px', minWidth: '200px' }}>
          <h3>Moves</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>#</th>
                <th style={{ textAlign: 'center' }}>White</th>
                <th style={{ textAlign: 'center' }}>Black</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, idx) => {
                const whiteMove = moveHistory[idx * 2];
                const blackMove = moveHistory[idx * 2 + 1];
                return (
                  <tr key={idx}>
                    <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ textAlign: 'center' }}>{whiteMove ? whiteMove.notation : ''}</td>
                    <td style={{ textAlign: 'center' }}>{blackMove ? blackMove.notation : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
        <button className="chess-resign-btn" onClick={handleResign} disabled={!!checkmate}>
          Resign
        </button>
        {checkmate && (
          <div className="chess-checkmate-msg">
            {turn === 'w' ? 'White' : 'Black'} resigned.<br />
            {checkmate === 'w' ? 'White' : 'Black'} wins!<br />
            <button className="chess-newgame-btn" onClick={handleNewGame}>Start New Game</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChessBoard;
