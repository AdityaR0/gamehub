// src/games/DinoRun.jsx

import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/DinoRun.css';

const GAME_ID = 'dino-run';
const GAME_WIDTH = 400; 
const GAME_HEIGHT = 200;
const DINO_SIZE = 30;
const OBSTACLE_WIDTH = 20;

const JUMP_FORCE = 10;
const GRAVITY = 1; 

const INITIAL_OBSTACLE_SPEED = 4; // Start speed
const INITIAL_TICK_RATE = 40; // 40ms per tick (25 FPS)
const SPEED_INCREMENT_SCORE = 10; // Increase speed every 10 points

const initialDinoYFromBottom = 0; 

function DinoRun() {
    const [dinoY, setDinoY] = useState(initialDinoYFromBottom);
    const [velocity, setVelocity] = useState(0);
    const [score, setScore] = useState(0);
    const [gameActive, setGameActive] = useState(false);
    const [status, setStatus] = useState("Press SPACE or click to start/jump.");
    const [obstacleX, setObstacleX] = useState(GAME_WIDTH);
    const [isJumping, setIsJumping] = useState(false);
    
    // *** NEW DYNAMIC STATE ***
    const [currentObstacleSpeed, setCurrentObstacleSpeed] = useState(INITIAL_OBSTACLE_SPEED);
    const [currentTickRate, setCurrentTickRate] = useState(INITIAL_TICK_RATE);

    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 
    const gameLoopRef = useRef(null);

    const recordGameResult = useCallback(async (finalScore) => { /* ... record logic ... */ }, [isAuthenticated, token, updateUser]);

    const handleGameOver = useCallback(() => {
        setGameActive(false);
        setStatus(`Game Over! Score: ${score}`);
        recordGameResult(score);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }, [score, recordGameResult]);

    // --- Jump and Input Logic ---
    const handleJump = useCallback(() => {
        if (!gameActive || isJumping) return;
        
        if (dinoY === initialDinoYFromBottom) { 
            setVelocity(-JUMP_FORCE);
            setIsJumping(true);
        }
    }, [gameActive, isJumping, dinoY]);

    const handleKeyDown = useCallback((e) => {
        if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (!gameActive) {
                handleReset();
            } else {
                handleJump();
            }
        }
    }, [gameActive, handleJump]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);


    // --- Game Logic Loop (Includes Acceleration) ---
    const updateGame = useCallback(() => {
        if (!gameActive) return;

        // 1. Apply Physics
        setVelocity(v => v + GRAVITY);
        setDinoY(y => {
            let newY = y - velocity;

            if (newY <= initialDinoYFromBottom) {
                newY = initialDinoYFromBottom;
                setVelocity(0);
                setIsJumping(false);
            }
            return newY;
        });
        
        // 2. Obstacle Movement & Reset (Using dynamic speed)
        setObstacleX(x => {
            let newX = x - currentObstacleSpeed; // Use dynamic speed
            if (newX < -OBSTACLE_WIDTH) {
                newX = GAME_WIDTH;
                
                // Score increment and ACCELERATION CHECK
                setScore(s => {
                    const newScore = s + 1;
                    if (newScore > 0 && newScore % SPEED_INCREMENT_SCORE === 0) {
                        setCurrentObstacleSpeed(prevSpeed => Math.min(prevSpeed + 1, 15)); 
                        setCurrentTickRate(prevRate => Math.max(prevRate - 2, 20)); 
                    }
                    return newScore;
                });
            }
            return newX;
        });

        // 3. Collision Check (Simplified)
        const dinoX = 50; 
        const dinoYBottom = dinoY;
        
        const isHorizontalOverlap = dinoX < obstacleX + OBSTACLE_WIDTH && dinoX + DINO_SIZE > obstacleX;
        const isVerticalOverlap = dinoYBottom <= initialDinoYFromBottom + 1; 

        if (isHorizontalOverlap && isVerticalOverlap) {
            handleGameOver();
        }
        
    }, [gameActive, velocity, dinoY, obstacleX, handleGameOver, currentObstacleSpeed]); // currentObstacleSpeed added as dependency


    // --- Game Loop Effect (Updated to use dynamic currentTickRate) ---
    useEffect(() => {
        if (gameActive) {
            gameLoopRef.current = setInterval(updateGame, currentTickRate);
            setStatus("Running...");
        } else if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
        }
        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, [gameActive, updateGame, currentTickRate]); // currentTickRate is now a dependency


    const handleReset = () => {
        setDinoY(initialDinoYFromBottom);
        setVelocity(0);
        setScore(0);
        setObstacleX(GAME_WIDTH);
        setIsJumping(false);
        // Reset dynamic speed to initial values
        setCurrentObstacleSpeed(INITIAL_OBSTACLE_SPEED);
        setCurrentTickRate(INITIAL_TICK_RATE); 
        setGameActive(true);
        setStatus("Running...");
    };

    return (
        <div className="game-content">
            <h1>Dino Run</h1>
            <div className="dr-container" id="dino-run-game">

                <div className="dr-stats">
                    <span className="dr-stat-label">Score: {score}</span>
                </div>

                <div 
                    id="dr-board"
                    style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px` }}
                    onClick={handleJump}
                >
                    {/* Dino (Positioned from bottom) */}
                    <div 
                        className="dr-dino" 
                        style={{ bottom: `${dinoY}px`, left: `50px`, width: `${DINO_SIZE}px`, height: `${DINO_SIZE}px` }}
                    >🦖</div>

                    {/* Ground line */}
                    <div className="dr-ground"></div>

                    {/* Obstacle (Positioned from bottom) */}
                    <div 
                        className="dr-obstacle" 
                        style={{ bottom: `${initialDinoYFromBottom}px`, left: `${obstacleX}px`, width: `${OBSTACLE_WIDTH}px`, height: `${OBSTACLE_WIDTH}px` }}
                    >🌵</div>
                </div>

                <h2 id="game-status">{status}</h2>

                <button 
                    id="start-button"
                    className="dr-reset-btn" 
                    onClick={handleReset}>
                    {gameActive ? 'Restart' : 'Start Game'}
                </button>
            </div>
        </div>
    );
}

export default DinoRun;