// src/games/Chess.jsx

import React, { useState, useCallback, useMemo, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/Chess.css';

const GAME_ID = 'chess';
const ROWS = 8;
const COLS = 8;

// Simplified initial board setup (Unicode pieces)
const initialBoard = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
];

function Chess() {
    const [board, setBoard] = useState(initialBoard);
    const [currentPlayer, setCurrentPlayer] = useState('white');
    const [selectedSquare, setSelectedSquare] = useState(null); // {r, c}
    const [status, setStatus] = useState("White to move.");
    const [gameActive, setGameActive] = useState(true);

    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 
    
    const recordGameResult = useCallback(async (gameResult) => {
        // ... (record logic) ...
    }, [isAuthenticated, token, updateUser]);

    const handleSquareClick = useCallback((r, c) => {
        if (!gameActive) return;
        const piece = board[r][c];

        if (selectedSquare) {
            // Attempt a move
            const newBoard = board.map(row => [...row]);
            
            // Simplified move logic: Just move the piece without validation
            newBoard[r][c] = newBoard[selectedSquare.r][selectedSquare.c];
            newBoard[selectedSquare.r][selectedSquare.c] = null;
            
            setBoard(newBoard);
            setCurrentPlayer(prev => prev === 'white' ? 'black' : 'white');
            setSelectedSquare(null);
            setStatus(`Move executed. ${currentPlayer === 'white' ? 'Black' : 'White'} to move.`);
            
        } else if (piece) {
            // Select a piece
            setSelectedSquare({ r, c });
            setStatus(`Selected ${piece}. Click target square.`);
        }
    }, [gameActive, board, selectedSquare, currentPlayer]);

    const handleReset = () => {
        setBoard(initialBoard);
        setCurrentPlayer('white');
        setSelectedSquare(null);
        setStatus("White to move.");
        setGameActive(true);
    };

    return (
        <div className="game-content">
            <h1>Chess</h1>
            <div className="chess-container" id="chess-game">

                <div className="chess-stats">
                    <span className="chess-stat-label">Current Player: {currentPlayer}</span>
                </div>

                <div id="chess-board">
                    {board.flat().map((piece, index) => {
                        const r = Math.floor(index / COLS);
                        const c = index % COLS;
                        const isLight = (r + c) % 2 === 0;
                        const isSelected = selectedSquare && selectedSquare.r === r && selectedSquare.c === c;
                        
                        return (
                            <div
                                key={index}
                                className={`chess-square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleSquareClick(r, c)}
                            >
                                {piece}
                            </div>
                        );
                    })}
                </div>

                <h2 id="game-status" className="chess-game-status">{status}</h2>

                <button 
                    id="reset-button"
                    className="chess-reset-btn" 
                    onClick={handleReset}>
                    New Game
                </button>
            </div>
        </div>
    );
}

export default Chess;