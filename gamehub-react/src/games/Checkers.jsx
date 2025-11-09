// src/games/Checkers.jsx

import React, { useState, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/Checkers.css';

const GAME_ID = 'checkers';
const ROWS = 8;
const COLS = 8;

// B=Black, W=White, N=Null (empty playable spot)
const initialBoard = [
    ['B', null, 'B', null, 'B', null, 'B', null],
    [null, 'B', null, 'B', null, 'B', null, 'B'],
    ['B', null, 'B', null, 'B', null, 'B', null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, 'W', null, 'W', null, 'W', null, 'W'],
    ['W', null, 'W', null, 'W', null, 'W', null],
    [null, 'W', null, 'W', null, 'W', null, 'W'],
];

function Checkers() {
    const [board, setBoard] = useState(initialBoard);
    const [currentPlayer, setCurrentPlayer] = useState('W'); // White moves first
    const [selectedSquare, setSelectedSquare] = useState(null); 
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
            // Attempt a move (Simplified: move to any empty spot)
            if (piece === null) {
                const newBoard = board.map(row => [...row]);
                newBoard[r][c] = newBoard[selectedSquare.r][selectedSquare.c]; // Move piece
                newBoard[selectedSquare.r][selectedSquare.c] = null; // Clear old spot
                
                // Check for 'King' promotion (Simplified)
                if ((newBoard[r][c] === 'W' && r === 0) || (newBoard[r][c] === 'B' && r === 7)) {
                    newBoard[r][c] += 'K'; // e.g., 'WK' or 'BK'
                }

                setBoard(newBoard);
                setCurrentPlayer(prev => prev === 'W' ? 'B' : 'W');
                setSelectedSquare(null);
                setStatus(`Move made. ${currentPlayer === 'W' ? 'Black' : 'White'} to move.`);
            } else {
                setSelectedSquare(null); // Deselect if target is occupied
                setStatus("Target square is occupied.");
            }
        } else if (piece && piece.startsWith(currentPlayer)) {
            // Select a piece belonging to the current player
            setSelectedSquare({ r, c });
            setStatus(`Selected piece. Click target empty square.`);
        }
    }, [gameActive, board, selectedSquare, currentPlayer]);

    const handleReset = () => {
        setBoard(initialBoard);
        setCurrentPlayer('W');
        setSelectedSquare(null);
        setStatus("White to move.");
        setGameActive(true);
    };

    const renderPiece = (piece) => {
        if (!piece) return null;
        if (piece === 'W') return '⚪';
        if (piece === 'WK') return '👑';
        if (piece === 'B') return '⚫';
        if (piece === 'BK') return '👑'; 
        return null;
    };

    return (
        <div className="game-content">
            <h1>Checkers</h1>
            <div className="ckr-container" id="checkers-game">

                <div className="ckr-stats">
                    <span className="ckr-stat-label">Turn: {currentPlayer === 'W' ? 'White (⚪)' : 'Black (⚫)'}</span>
                </div>

                <div id="ckr-board">
                    {board.flat().map((piece, index) => {
                        const r = Math.floor(index / COLS);
                        const c = index % COLS;
                        const isLight = (r + c) % 2 === 0;
                        const isPlayable = !isLight; // Playable spots are always the dark squares
                        const isSelected = selectedSquare && selectedSquare.r === r && selectedSquare.c === c;
                        
                        return (
                            <div
                                key={index}
                                className={`ckr-square ${isLight ? 'light' : 'dark'} ${isPlayable ? 'playable' : ''} ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleSquareClick(r, c)}
                            >
                                {renderPiece(piece)}
                            </div>
                        );
                    })}
                </div>

                <h2 id="game-status" className="ckr-game-status">{status}</h2>

                <button 
                    id="reset-button"
                    className="ckr-reset-btn" 
                    onClick={handleReset}>
                    New Game
                </button>
            </div>
        </div>
    );
}

export default Checkers;