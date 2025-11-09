// src/games/Tetris.jsx

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/Tetris.css';

const GAME_ID = 'tetris';
const ROWS = 20;
const COLS = 10;
const INITIAL_DROP_TIME = 1000; // 1 second drop speed

// --- TETROMINO DEFINITIONS ---
const TETROMINOS = {
    0: { shape: [[0]], color: '0' }, // Empty cell (Black)
    I: { shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], color: 'cyan' },
    J: { shape: [[0, 1, 0], [0, 1, 0], [1, 1, 0]], color: 'blue' },
    L: { shape: [[0, 1, 0], [0, 1, 0], [0, 1, 1]], color: 'orange' },
    O: { shape: [[1, 1], [1, 1]], color: 'yellow' },
    S: { shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], color: 'green' },
    T: { shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]], color: 'purple' },
    Z: { shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], color: 'red' },
};
const PIECES = 'IJLOSTZ';

const randomTetromino = () => {
    const randPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
    return TETROMINOS[randPiece];
};

const createEmptyBoard = () => Array(ROWS).fill(null).map(() => Array(COLS).fill('0'));

// --- Collision Detection Helper ---
const checkCollision = (tetromino, pos, board) => {
    for (let y = 0; y < tetromino.length; y++) {
        for (let x = 0; x < tetromino[y].length; x++) {
            if (tetromino[y][x] !== 0) {
                if (
                    !board[y + pos.y] || // Check height (floor/ceiling)
                    !board[y + pos.y][x + pos.x] || // Check width (side walls)
                    board[y + pos.y][x + pos.x] !== '0' // Check if cell is already occupied
                ) {
                    return true;
                }
            }
        }
    }
    return false;
};

// --- Game Over Check Helper ---
const checkGameOver = (newTetro, board) => {
    // Check if the initial spawn position (y=0) is already blocked
    const spawnPos = { x: COLS / 2 - 2, y: 0 };
    return checkCollision(newTetro.shape, spawnPos, board);
}


function Tetris() {
    const [board, setBoard] = useState(createEmptyBoard);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [gameActive, setGameActive] = useState(false);
    const [status, setStatus] = useState("Press Start and use arrow keys.");
    const [dropTime, setDropTime] = useState(INITIAL_DROP_TIME);

    const [player, setPlayer] = useState({
        pos: { x: 0, y: 0 }, 
        tetromino: TETROMINOS[0].shape,
        color: TETROMINOS[0].color,
        collided: false,
    });

    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 

    const recordGameResult = useCallback(async (finalScore) => { /* ... record logic ... */ }, [isAuthenticated, token, updateUser]);


    // --- Piece Management (Spawn/Lock) ---

    const updatePlayer = useCallback(() => {
        const newTetro = randomTetromino();
        const spawnPos = { x: COLS / 2 - 2, y: 0 };
        
        // GAME OVER CHECK ON SPAWN
        if (checkGameOver(newTetro, board)) {
            setGameActive(false);
            setStatus(`GAME OVER! Final Score: ${score} 💥`);
            recordGameResult(score);
            return; 
        }

        // Spawn the new piece
        setPlayer({
            pos: spawnPos, 
            tetromino: newTetro.shape,
            color: newTetro.color,
            collided: false,
        });
        
    }, [board, score, recordGameResult]);

    const lockPiece = useCallback(() => {
        const newBoard = board.map(row => [...row]);

        player.tetromino.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    if (y + player.pos.y < ROWS && x + player.pos.x < COLS) {
                        // Permanently write the piece's color to the board
                        newBoard[y + player.pos.y][x + player.pos.x] = player.color;
                    }
                }
            });
        });
        
        setBoard(newBoard);
        updatePlayer(); // Spawn the next piece
    }, [board, player, updatePlayer]); 


    // --- Core Piece Movement Logic ---
    const movePlayer = useCallback((dir) => {
        if (!gameActive) return;
        
        const newPos = { ...player.pos, x: player.pos.x + dir };
        if (!checkCollision(player.tetromino, newPos, board)) {
            setPlayer(prev => ({ ...prev, pos: newPos }));
        }
    }, [gameActive, player, board]);

    const drop = useCallback(() => {
        const newPos = { ...player.pos, y: player.pos.y + 1 };
        
        if (!checkCollision(player.tetromino, newPos, board)) {
            // Keep falling
            setPlayer(prev => ({ ...prev, pos: newPos }));
        } else {
            // Collision detected (Lock the piece)
            if (!player.collided) {
                setPlayer(prev => ({ ...prev, collided: true }));
                lockPiece(); 
            }
        }
    }, [player, board, lockPiece]);


    // --- Game Loop (Falling) ---
    useEffect(() => {
        if (!gameActive) return;
        
        const interval = setInterval(drop, dropTime);
        
        return () => clearInterval(interval);
    }, [gameActive, drop, dropTime]);


    // --- Input Handling ---
    const handleKey = useCallback((e) => {
        if (!gameActive) return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            movePlayer(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            movePlayer(1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            drop(); // Soft drop
        }
    }, [gameActive, movePlayer, drop]);

    useEffect(() => {
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleKey]);


    // --- Start/Pause/Resume Logic (FIX 2) ---
    const handlePauseResume = () => {
        setGameActive(prev => !prev);
        setStatus(gameActive ? "Game Paused" : "Game Running...");
    };

    const handleStart = () => {
        if (!gameActive) {
            setBoard(createEmptyBoard());
            setScore(0);
            setLevel(1);
            setDropTime(INITIAL_DROP_TIME);
            updatePlayer(); // Spawn the first piece!
            setGameActive(true);
            setStatus("Game Running...");
        }
    };

    // --- Rendering: Merge falling piece with static board ---
    const mergedBoard = board.map((row, r) =>
        row.map((cell, c) => {
            const pieceRow = r - player.pos.y;
            const pieceCol = c - player.pos.x;

            if (
                pieceRow >= 0 && pieceRow < player.tetromino.length &&
                pieceCol >= 0 && pieceCol < player.tetromino[0].length &&
                player.tetromino[pieceRow][pieceCol] !== 0
            ) {
                return player.color; 
            }
            return cell; 
        })
    );


    return (
        <div className="game-content">
            <h1>Tetris</h1>
            <div className="tt-container" id="tetris-game">

                <div className="tt-stats">
                    <span className="tt-stat-label">Score: {score}</span>
                    <span className="tt-stat-label">Level: {level}</span>
                    <div className="tt-next-piece-box">Next:</div> 
                </div>

                <div id="tt-board">
                    {/* Render the MERGED board */}
                    {mergedBoard.flat().map((color, index) => (
                        <div 
                            key={index} 
                            className={`tt-cell tt-color-${color}`}
                        ></div>
                    ))}
                </div>

                <h2 id="game-status" className="tt-game-status">{status}</h2>

                <button 
                    id="start-button"
                    className="tt-reset-btn" 
                    // Use a conditional click handler for correct action
                    onClick={gameActive ? handlePauseResume : handleStart}>
                    
                    {/* Correct button text based on state */}
                    {gameActive ? 'Pause Game' : 'Start Game'}
                </button>
            </div>
        </div>
    );
}

export default Tetris;