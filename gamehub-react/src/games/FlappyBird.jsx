// src/games/FlappyBird.jsx

import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/FlappyBird.css';

const GAME_ID = 'flappy-bird';
const GRAVITY = 0.3; 
const JUMP_FORCE = -6; 
const BIRD_SIZE = 30;
const GAME_WIDTH = 400; 
const GAME_HEIGHT = 600; 
const PIPE_WIDTH = 50;

// DIFFICULTY CONSTANTS
const BASE_PIPE_GAP = 200; // Easiest gap
const BASE_PIPE_SPEED = 2; // Slowest speed

// Difficulty Tiers: [Score Threshold, New Speed, New Gap]
const DIFFICULTY_TIERS = [
    [0, BASE_PIPE_SPEED, BASE_PIPE_GAP],       // Score 0-9: Easy
    [10, 2.5, 180],                           // Score 10+: Slightly harder
    [25, 3.0, 160],                           // Score 25+: Moderate difficulty
    [50, 3.5, 140],                           // Score 50+: Hard difficulty
    [75, 4.0, 130],                           // Score 75+: Expert difficulty
];

// --- Helper function to determine game difficulty based on score ---
const getDifficultyParams = (currentScore) => {
    // Find the highest score tier achieved by reversing the list
    const tier = DIFFICULTY_TIERS.slice().reverse().find(([threshold]) => currentScore >= threshold);
    
    // tier[1] = speed, tier[2] = gap
    return {
        speed: tier ? tier[1] : BASE_PIPE_SPEED,
        gap: tier ? tier[2] : BASE_PIPE_GAP,
    };
};

// --- Helper function to create a new pipe object ---
const createPipe = (xPosition, currentGap) => {
    // Ensure the gap is at least the minimum allowed for boundaries
    const safeGap = currentGap || BASE_PIPE_GAP;

    // Random height for the top pipe, ensuring there's room for the gap and boundaries
    const minHeight = 50;
    const maxHeight = GAME_HEIGHT - safeGap - minHeight;
    const newHeight = Math.floor(Math.random() * maxHeight) + minHeight;
    
    return {
        x: xPosition,
        topPipeHeight: newHeight,
        passed: false,
    };
};
// ---------------------------------------------------


function FlappyBird() {
    const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
    const [birdVelocity, setBirdVelocity] = useState(0);
    const [score, setScore] = useState(0);
    const [gameActive, setGameActive] = useState(false);
    const [status, setStatus] = useState("Click to Jump! Hit Start.");
    const [pipes, setPipes] = useState([]); 

    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 
    const gameLoopRef = useRef(null);
    const gameActiveRef = useRef(gameActive); 

    // Initial state object for easy reset
    const initialGameState = {
        birdY: GAME_HEIGHT / 2,
        birdVelocity: 0,
        score: 0,
        pipes: [],
        status: "Click to Jump! Hit Start."
    };

    // NOTE: recordGameResult logic is simplified here
    const recordGameResult = useCallback(async (finalScore) => {
        if (!isAuthenticated) return;
        // This is where you would call your backend API to update stats
        // await updateUser(GAME_ID, finalScore);
    }, [isAuthenticated, token, updateUser]);
    
    // --- Collision and Game Over Logic ---
    const checkCollision = useCallback((currentBirdY, currentPipes, currentGap) => {
        // 1. Floor/Ceiling Collision
        if (currentBirdY >= GAME_HEIGHT - BIRD_SIZE || currentBirdY <= 0) {
            return true;
        }

        // 2. Pipe Collision
        for (const pipe of currentPipes) {
            const pipeBottomY = pipe.topPipeHeight + currentGap; // Use dynamic gap

            // Check if bird is horizontally aligned with the pipe (Bird is at x=50)
            if (pipe.x < 50 + BIRD_SIZE && pipe.x + PIPE_WIDTH > 50) {
                // Check if bird hits top pipe or bottom pipe
                if (currentBirdY < pipe.topPipeHeight || currentBirdY + BIRD_SIZE > pipeBottomY) {
                    return true;
                }
            }
        }
        return false;
    }, []);
    
    // Game loop that drives all state updates
    const updateGame = useCallback(() => {
        
        // *** NEW: Get dynamic speed and gap based on current score ***
        const { speed, gap } = getDifficultyParams(score); 
        
        // 1. Update Bird Physics
        setBirdVelocity(v => v + GRAVITY);
        
        setBirdY(y => {
            let newY = y + birdVelocity;
            
            // Check collision BEFORE rendering the new Y position, passing dynamic gap
            if (checkCollision(newY, pipes, gap)) { 
                if (gameActiveRef.current) { 
                    setGameActive(false);
                    setStatus(`Game Over! Score: ${score} 💥`);
                    recordGameResult(score);
                }
                if (newY < 0) return 0;
                if (newY > GAME_HEIGHT - BIRD_SIZE) return GAME_HEIGHT - BIRD_SIZE;
            }
            return newY;
        });

        // 2. Pipe movement and score update
        setPipes(currentPipes => {
            let updatedPipes = currentPipes.map(p => ({
                ...p,
                // Use dynamic speed
                x: p.x - speed
            })).filter(p => p.x > -PIPE_WIDTH); 

            // Pipe Scheduling Logic: Add new pipe when the last one is 1/3 of the screen width in
            const pipeScheduleDistance = GAME_WIDTH / 2.5; 

            if (updatedPipes.length === 0 || GAME_WIDTH - updatedPipes[updatedPipes.length - 1].x > pipeScheduleDistance) {
                // Create new pipe using the dynamic gap
                updatedPipes.push(createPipe(GAME_WIDTH, gap)); 
            }
            
            // 3. Score check (using setScore callback to ensure accuracy)
            setScore(s => {
                const newScore = s;
                // Find a pipe that hasn't been passed AND has moved past the bird's X position (x=50)
                const pipeToScore = updatedPipes.find(p => !p.passed && p.x + PIPE_WIDTH < 50); 
                
                if (pipeToScore && !pipeToScore.passed) {
                    pipeToScore.passed = true; 
                    return newScore + 1; 
                }
                return newScore; 
            });

            return updatedPipes;
        });

        if (gameActiveRef.current) {
            gameLoopRef.current = requestAnimationFrame(updateGame);
        }
    }, [birdVelocity, pipes, score, recordGameResult, checkCollision]);
    
    // Effect to start/stop the loop
    useEffect(() => {
        gameActiveRef.current = gameActive;
        if (gameActive) {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); 
            gameLoopRef.current = requestAnimationFrame(updateGame);
        } else {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        }
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [gameActive, updateGame]); 
    
    const handleJump = useCallback(() => {
        if (!gameActive) {
            handleReset(); // Start game on first click/jump
            return;
        }
        setBirdVelocity(JUMP_FORCE);
    }, [gameActive]);
    
    // Add Spacebar Listener
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent scrolling
                handleJump();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleJump]); 

    const handleReset = () => {
        // Initialize with the first pipe using the base (easy) gap
        const firstPipe = createPipe(GAME_WIDTH, BASE_PIPE_GAP); 
        
        setBirdY(initialGameState.birdY);
        setBirdVelocity(initialGameState.birdVelocity);
        setScore(initialGameState.score);
        setPipes([firstPipe]); 
        setStatus("Game Running...");
        setGameActive(true);
    };

    return (
        <div className="game-content">
            <h1>Flappy Bird</h1>
            <div className="fb-container" id="flappy-bird-game">

                <div className="fb-stats">
                    <span className="fb-stat-label">Score: {score}</span>
                </div>

                <div 
                    id="fb-board" 
                    style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px` }}
                    onClick={handleJump}
                >
                    {/* Bird */}
                    <div 
                        className="fb-bird" 
                        style={{ 
                            top: `${birdY}px`, 
                            left: `50px`,
                            height: `${BIRD_SIZE}px`,
                            width: `${BIRD_SIZE}px`,
                            transition: gameActive ? 'none' : 'top 0.5s ease-out' 
                        }}
                    >
                        <span role="img" aria-label="bird">🐥</span>
                    </div>

                    {/* Pipes */}
                    {pipes.map((pipe, index) => (
                        <React.Fragment key={index}>
                            {/* Pipe (Top) */}
                            <div 
                                className="fb-pipe top-pipe" 
                                style={{ 
                                    left: `${pipe.x}px`, 
                                    height: `${pipe.topPipeHeight}px`,
                                    width: `${PIPE_WIDTH}px`
                                }}
                            ></div>

                            {/* Pipe (Bottom) */}
                            <div 
                                className="fb-pipe bottom-pipe" 
                                style={{ 
                                    left: `${pipe.x}px`, 
                                    top: `${pipe.topPipeHeight + getDifficultyParams(score).gap}px`, // Use current gap for rendering
                                    height: `${GAME_HEIGHT - pipe.topPipeHeight - getDifficultyParams(score).gap}px`,
                                    width: `${PIPE_WIDTH}px`
                                }}
                            ></div>
                        </React.Fragment>
                    ))}
                </div>

                <h2 id="game-status" className="fb-game-status">{status}</h2>

                <button 
                    id="reset-button"
                    className="fb-reset-btn" 
                    onClick={handleReset}>
                    {gameActive ? 'Restart' : 'Start Game'}
                </button>
            </div>
        </div>
    );
}

export default FlappyBird;