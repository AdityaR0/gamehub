// src/games/Game2048.jsx (Renamed to Game2048 to avoid confusion with numbers)

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/Game2048.css';

const GRID_SIZE = 4;
const GAME_ID = '2048';

// Tile Colors (You'll need these in your CSS)
const TILE_COLORS = {
    2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563', 32: '#f67c5f', 
    64: '#f65e3b', 128: '#edcf72', 256: '#edcc61', 512: '#edc850', 1024: '#edc53f', 
    2048: '#edc22e', default: '#3c3a32'
};

const generateRandomTile = (board) => {
    let emptyCells = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (board[r][c] === 0) emptyCells.push({ r, c });
        }
    }
    if (emptyCells.length === 0) return false;

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4
    return true;
};

const INITIAL_BOARD = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
generateRandomTile(INITIAL_BOARD);
generateRandomTile(INITIAL_BOARD);

const applyMove = (board, direction) => {
    // Complex game logic (sliding, merging, generating new tile)
    // Simplified version for code length:
    let newBoard = board.map(row => [...row]);
    let hasMoved = false;

    // ... (Full implementation of sliding and merging logic here is lengthy) ...
    
    // Placeholder implementation for a simplified experience:
    // This is the core logic that needs a robust implementation.
    // For now, let's just make it reset if they try to move.
    
    // A robust 2048 implementation needs a custom hook or deep game engine.
    // For this boilerplate, we'll keep it simple:
    
    // Simulate a move and return if it was successful
    // Example: If direction is 'LEFT', shift everything left and merge.
    
    return { newBoard: newBoard, moved: false }; // Placeholder
};

function Game2048() {
    const [board, setBoard] = useState(INITIAL_BOARD);
    const [score, setScore] = useState(0);
    const [gameActive, setGameActive] = useState(true);
    const [status, setStatus] = useState("Use arrow keys to slide tiles.");

    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 
    
    const recordGameResult = useCallback(async (finalScore) => {
        if (!isAuthenticated || !token || finalScore <= 0) return; 

        try {
            const response = await fetch('http://localhost:3001/api/stats/record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ gameId: GAME_ID, result: 'score', value: finalScore }),
            });
            if (response.ok) {
                const successData = await response.json();
                if (successData.user && updateUser) updateUser(successData.user); 
            }
        } catch (error) {
            console.error('2048: Network error recording result:', error);
        }
    }, [isAuthenticated, token, updateUser]);

    const handleKeyDown = useCallback((e) => {
        if (!gameActive) return;

        let direction;
        switch (e.key) {
            case 'ArrowUp': direction = 'UP'; break;
            case 'ArrowDown': direction = 'DOWN'; break;
            case 'ArrowLeft': direction = 'LEFT'; break;
            case 'ArrowRight': direction = 'RIGHT'; break;
            default: return;
        }
        e.preventDefault();

        // **NOTE:** In the real implementation, replace this with the actual game logic:
        // const { newBoard, moved, points } = applyMove(board, direction);
        
        // --- Simplified move handling for boilerplate ---
        setStatus("Real logic implementation needed! Resetting for now.");
        resetGame();
        // --- End Simplified handling ---

    }, [gameActive, board]);


    useEffect(() => {
        if (gameActive) {
            window.addEventListener('keydown', handleKeyDown);
        }
        // TODO: Add check for 2048 tile and game over state.
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameActive, handleKeyDown]);


    const resetGame = () => {
        const resetBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
        generateRandomTile(resetBoard);
        generateRandomTile(resetBoard);
        setBoard(resetBoard);
        setScore(0);
        setGameActive(true);
        setStatus("Use arrow keys to slide tiles.");
    };


    return (
        <div className="game-content">
            <h1>2048</h1>
            <div className="game-2048-container" id="game-2048-game">

                <div className="game-2048-stats">
                    <span className="game-2048-stat-label">Score: {score}</span>
                    <button className="game-2048-reset-btn" onClick={resetGame}>New Game</button>
                </div>

                <div id="game-2048-board">
                    {board.flat().map((value, index) => (
                        <div 
                            key={index} 
                            className={`game-2048-tile tile-${value}`}
                            style={{ backgroundColor: TILE_COLORS[value] || TILE_COLORS.default }}
                        >
                            {value > 0 ? value : ''}
                        </div>
                    ))}
                </div>

                <h2 id="game-status">{status}</h2>
            </div>
        </div>
    );
}

export default Game2048;