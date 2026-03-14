import React from 'react';
import './App.css';
import Header from './components/Header';
import ChessBoard from './components/ChessBoard';
import Chat from './components/Chat';

function App() {
  return (
    <div className="d-flex flex-column vh-100">
      <Header />

      {/* body: chessboard in center, chat on right */}
      <div className="app-body d-flex flex-grow-1">
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <ChessBoard />
        </div>
        <Chat />
      </div>
    </div>
  );
}

export default App;
