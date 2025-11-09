// src/games/Breakout.jsx

import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/Breakout.css';

const GAME_ID = 'breakout';
const BOARD_WIDTH = 450; 
const BOARD_HEIGHT = 400;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 10;
const PADDLE_SPEED = 15; // Speed boost for keyboard moves
const BALL_SIZE = 8;
const BALL_SPEED = 4; 

const BLOCK_ROWS = 5;
const BLOCK_COLS = 10;
const BLOCK_WIDTH = BOARD_WIDTH / BLOCK_COLS;
const BLOCK_HEIGHT = 18;
const BLOCK_START_Y = 30;

const initialBallState = { x: BOARD_WIDTH / 2, y: BOARD_HEIGHT - 30, dx: BALL_SPEED, dy: -BALL_SPEED };
const generateBlocks = () => {
    let blocks = [];
    let id = 0;
    for (let r = 0; r < BLOCK_ROWS; r++) {
        for (let c = 0; c < BLOCK_COLS; c++) {
            blocks.push({
                id: id++,
                x: c * BLOCK_WIDTH,
                y: BLOCK_START_Y + r * BLOCK_HEIGHT,
            });
        }
    }
    return blocks;
};

function Breakout() {
    const [ball, setBall] = useState(initialBallState);
    const [paddleX, setPaddleX] = useState((BOARD_WIDTH - PADDLE_WIDTH) / 2);
    const [blocks, setBlocks] = useState(generateBlocks);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameActive, setGameActive] = useState(false);
    const [status, setStatus] = useState("Press Start Game");
    
    // NEW STATE: Tracks current keyboard movement direction
    const [keyMovement, setKeyMovement] = useState(0); // -1 for left, 1 for right, 0 for none

    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 
    const gameLoopRef = useRef(null);

    const recordGameResult = useCallback(async (finalScore) => { /* ... record logic ... */ }, [isAuthenticated, token, updateUser]);


    // --- 1. Keyboard Input Handlers ---
    const handleKeyDown = useCallback((e) => {
        if (!gameActive) return;
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setKeyMovement(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            setKeyMovement(1);
        }
    }, [gameActive]);

    const handleKeyUp = useCallback((e) => {
        if (!gameActive) return;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            setKeyMovement(0);
        }
    }, [gameActive]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);
    
    // --- 2. Game Loop and Physics ---
    const updateGame = useCallback(() => {
        
        // PADDLE MOVEMENT: Apply keyboard movement instantly
        setPaddleX(currentX => {
            if (keyMovement !== 0) {
                const newX = currentX + keyMovement * PADDLE_SPEED;
                return Math.max(0, Math.min(newX, BOARD_WIDTH - PADDLE_WIDTH));
            }
            return currentX;
        });

        // BALL PHYSICS & COLLISION: 
        setBall(prevBall => {
            // ... (rest of the physics logic remains the same) ...
            let { x, y, dx, dy } = prevBall;

            // 1. Check Win Condition
            if (blocks.length === 0) {
                setGameActive(false);
                setStatus(`YOU WIN! Final Score: ${score}`);
                recordGameResult(score);
                return prevBall;
            }

            // Update position
            x += dx;
            y += dy;

            // 2. Wall Collision (Left/Right/Top)
            if (x < 0 || x > BOARD_WIDTH - BALL_SIZE) { dx = -dx; }
            if (y < 0) { dy = -dy; }

            // 3. Lose Life (Bottom)
            if (y > BOARD_HEIGHT - BALL_SIZE) {
                if (lives > 1) {
                    setLives(l => l - 1);
                    setStatus(`Ball lost! Lives left: ${lives - 1}`);
                    return { ...initialBallState, dx: prevBall.dx, dy: prevBall.dy }; 
                } else {
                    setGameActive(false);
                    setStatus(`Game Over! Final Score: ${score}`);
                    recordGameResult(score);
                    return prevBall;
                }
            }

            // 4. Paddle Collision
            const paddleY = BOARD_HEIGHT - PADDLE_HEIGHT - 10;
            if (y + BALL_SIZE > paddleY && y < paddleY + PADDLE_HEIGHT &&
                x + BALL_SIZE > paddleX && x < paddleX + PADDLE_WIDTH && dy > 0) 
            {
                dy = -dy;
                const hitPoint = (x - (paddleX + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2);
                dx += hitPoint * 0.5;
            }

            // 5. BLOCK COLLISION AND DESTRUCTION 
            let blocksRemaining = [...blocks];
            for (let i = 0; i < blocksRemaining.length; i++) {
                const block = blocksRemaining[i];

                if (x + BALL_SIZE > block.x && x < block.x + BLOCK_WIDTH &&
                    y + BALL_SIZE > block.y && y < block.y + BLOCK_HEIGHT) 
                {
                    const prevY = y - dy;
                    if (prevY + BALL_SIZE <= block.y || prevY >= block.y + BLOCK_HEIGHT) {
                        dx = -dx; // Horizontal hit
                    } else {
                        dy = -dy; // Vertical hit
                    }

                    blocksRemaining.splice(i, 1);
                    setBlocks(blocksRemaining); 
                    setScore(s => s + 10);
                    return { x, y, dx, dy }; // Apply bounce and exit
                }
            }
            
            return { x, y, dx, dy };
        });

        if (gameActive) {
            gameLoopRef.current = requestAnimationFrame(updateGame);
        }
    }, [gameActive, blocks, lives, paddleX, score, recordGameResult, keyMovement]);


    // --- 3. Mouse Input (Optional: For reliable input) ---
    // Keeping this external listener is the most reliable way to handle mouse input in React
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (!gameActive) return;
            const boardElement = document.getElementById('brk-board');
            if (!boardElement) return;

            const rect = boardElement.getBoundingClientRect();
            const newPaddleX = e.clientX - rect.left - PADDLE_WIDTH / 2;
            
            // Constrain paddle to board boundaries
            setPaddleX(Math.max(0, Math.min(newPaddleX, BOARD_WIDTH - PADDLE_WIDTH)));
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
        };
    }, [gameActive]);


    // --- 4. Loop Initialization ---
    useEffect(() => {
        if (gameActive) {
            gameLoopRef.current = requestAnimationFrame(updateGame);
            setStatus("Game Running!");
        } else {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        }
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [gameActive, updateGame]);


    const handleReset = () => {
        setBlocks(generateBlocks());
        setBall(initialBallState);
        setPaddleX((BOARD_WIDTH - PADDLE_WIDTH) / 2);
        setScore(0);
        setLives(3);
        setKeyMovement(0); // Reset keyboard state
        setGameActive(true);
        setStatus("Starting...");
    };

    return (
        <div className="game-content">
            <h1>Breakout</h1>
            <div className="brk-container" id="breakout-game">

                <div className="brk-stats">
                    <span className="brk-stat-label">Score: {score}</span>
                    <span className="brk-stat-label">Lives: {lives}</span>
                </div>

                <div 
                    id="brk-board" 
                    style={{ width: `${BOARD_WIDTH}px`, height: `${BOARD_HEIGHT}px` }}
                >
                    {/* Blocks */}
                    {blocks.map(block => (
                        <div 
                            key={block.id} 
                            className="brk-block" 
                            style={{ 
                                left: `${block.x}px`, 
                                top: `${block.y}px`,
                                width: `${BLOCK_WIDTH}px`,
                                height: `${BLOCK_HEIGHT}px`,
                            }}
                        ></div>
                    ))}

                    {/* Paddle */}
                    <div 
                        className="brk-paddle" 
                        style={{ left: `${paddleX}px`, width: `${PADDLE_WIDTH}px` }}
                    ></div>
                    
                    {/* Ball */}
                    <div 
                        className="brk-ball" 
                        style={{ left: `${ball.x}px`, top: `${ball.y}px` }}
                    ></div>
                </div>

                <h2 className="brk-game-status">{status}</h2>

                <button 
                    id="reset-button"
                    className="brk-reset-btn" 
                    onClick={handleReset}>
                    Start Game
                </button>
            </div>
        </div>
    );
}

export default Breakout;