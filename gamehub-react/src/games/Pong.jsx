// src/games/Pong.jsx

import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/Pong.css';

const GAME_ID = 'pong';
const BOARD_WIDTH = 400;
const BOARD_HEIGHT = 300;
const PADDLE_HEIGHT = 60;
const BALL_SIZE = 10;

// Initial state (using absolute coordinates for easy positioning)
const initialGameState = {
    player1Y: BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2, // Left paddle Y
    player2Y: BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2, // Right paddle Y
    ballX: BOARD_WIDTH / 2 - BALL_SIZE / 2,
    ballY: BOARD_HEIGHT / 2 - BALL_SIZE / 2,
    ballDX: 2, // Ball speed x
    ballDY: 2, // Ball speed y
    score1: 0,
    score2: 0,
};

function Pong() {
    const [gameState, setGameState] = useState(initialGameState);
    const [gameActive, setGameActive] = useState(false);
    const [status, setStatus] = useState("Press SPACE or click Start to play!");
    const gameLoopRef = useRef(null);

    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 

    const recordGameResult = useCallback(async (result) => {
        // ... (record logic) ...
    }, [isAuthenticated, token, updateUser]);

    // Game Logic: Move ball and check collisions
    const updateGame = useCallback(() => {
        setGameState(prev => {
            let newState = { ...prev };

            // 1. Move Ball
            newState.ballX += newState.ballDX;
            newState.ballY += newState.ballDY;

            // 2. Wall Collisions (Top/Bottom)
            if (newState.ballY <= 0 || newState.ballY >= BOARD_HEIGHT - BALL_SIZE) {
                newState.ballDY *= -1;
            }

            // 3. Paddle Collisions (Simplified for boilerplate)
            const isLeftPaddle = newState.ballX <= 10 && newState.ballY + BALL_SIZE >= newState.player1Y && newState.ballY <= newState.player1Y + PADDLE_HEIGHT;
            const isRightPaddle = newState.ballX >= BOARD_WIDTH - 20 && newState.ballY + BALL_SIZE >= newState.player2Y && newState.ballY <= newState.player2Y + PADDLE_HEIGHT;

            if (isLeftPaddle || isRightPaddle) {
                newState.ballDX *= -1;
            }

            // 4. Score Point (Goal)
            if (newState.ballX < 0) {
                // Player 2 scores
                newState.score2 += 1;
                resetBall(newState);
            } else if (newState.ballX > BOARD_WIDTH - BALL_SIZE) {
                // Player 1 scores
                newState.score1 += 1;
                resetBall(newState);
            }
            
            // Check win condition (e.g., score of 10)
            if (newState.score1 >= 5 || newState.score2 >= 5) {
                setStatus(newState.score1 >= 5 ? "Player 1 Wins!" : "Player 2 Wins!");
                setGameActive(false);
                recordGameResult(newState.score1 >= 5 ? 'win' : 'loss'); // Assuming Player 1 is the user
                return initialGameState; // Stop the game loop
            }

            return newState;
        });
        
        // Use requestAnimationFrame for smooth animation
        if (gameActive) {
            gameLoopRef.current = requestAnimationFrame(updateGame);
        }
    }, [gameActive, recordGameResult]);

    const resetBall = (state) => {
        state.ballX = BOARD_WIDTH / 2 - BALL_SIZE / 2;
        state.ballY = BOARD_HEIGHT / 2 - BALL_SIZE / 2;
        state.ballDX = (state.ballDX > 0 ? -2 : 2); // Switch direction after score
    };

    // Start/Stop Game
    const toggleGame = () => {
        if (!gameActive) {
            setGameActive(true);
            setStatus("Game in progress...");
        } else {
            setGameActive(false);
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
            setStatus("Game Paused. Click Start to resume.");
        }
    };

    useEffect(() => {
        if (gameActive) {
            gameLoopRef.current = requestAnimationFrame(updateGame);
        }
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [gameActive, updateGame]);

    // Input Handling (Player 1: W/S or Arrow Keys for P1/P2)
    useEffect(() => {
        const handleKey = (e) => {
            let newY = gameState.player1Y;
            if (e.key === 'w' || e.key === 'W') {
                newY = Math.max(0, newY - 15);
            } else if (e.key === 's' || e.key === 'S') {
                newY = Math.min(BOARD_HEIGHT - PADDLE_HEIGHT, newY + 15);
            }
            // For the two-player mode (assuming player 2 uses arrows)
            let newY2 = gameState.player2Y;
            if (e.key === 'ArrowUp') {
                newY2 = Math.max(0, newY2 - 15);
            } else if (e.key === 'ArrowDown') {
                newY2 = Math.min(BOARD_HEIGHT - PADDLE_HEIGHT, newY2 + 15);
            }

            setGameState(prev => ({ ...prev, player1Y: newY, player2Y: newY2 }));
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [gameState]);


    return (
        <div className="game-content">
            <h1>Pong</h1>
            <div className="pong-container" id="pong-game">

                <div className="pong-stats">
                    <span className="pong-stat-label">P1: {gameState.score1}</span>
                    <span className="pong-stat-label">P2: {gameState.score2}</span>
                </div>

                <div 
                    id="pong-board" 
                    style={{ width: `${BOARD_WIDTH}px`, height: `${BOARD_HEIGHT}px` }}
                >
                    {/* Player 1 Paddle (Left) */}
                    <div 
                        className="pong-paddle player-1-paddle" 
                        style={{ top: `${gameState.player1Y}px`, height: `${PADDLE_HEIGHT}px` }}
                    ></div>
                    
                    {/* Player 2 Paddle (Right) */}
                    <div 
                        className="pong-paddle player-2-paddle" 
                        style={{ top: `${gameState.player2Y}px`, height: `${PADDLE_HEIGHT}px` }}
                    ></div>
                    
                    {/* Ball */}
                    <div 
                        className="pong-ball" 
                        style={{ 
                            left: `${gameState.ballX}px`, 
                            top: `${gameState.ballY}px`,
                            width: `${BALL_SIZE}px`,
                            height: `${BALL_SIZE}px`,
                        }}
                    ></div>
                </div>

                <h2 id="game-status" className="pong-game-status">{status}</h2>

                <button 
                    id="reset-button"
                    className="pong-reset-btn" 
                    onClick={toggleGame}>
                    {gameActive ? 'Pause Game' : 'Start Game'}
                </button>
                <button 
                    className="pong-reset-btn secondary-btn" 
                    onClick={() => setGameState(initialGameState)}>
                    Reset Score
                </button>
            </div>
        </div>
    );
}

export default Pong;