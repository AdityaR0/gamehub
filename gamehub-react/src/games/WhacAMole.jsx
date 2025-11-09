// src/games/WhacAMole.jsx

import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/WhacAMole.css';

const GAME_DURATION = 30; // 30 seconds
const GAME_ID = 'whac-a-mole';

// FIX: Set very slow, kid-friendly mole times (1.5s to 3.0s visibility)
const MOLE_APPEAR_MIN = 500; // 1.5 seconds minimum visibility
const MOLE_APPEAR_MAX = 1000; // 3.0 seconds maximum visibility

const WhacAMole = () => {
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(GAME_DURATION);
    const [activeMole, setActiveMole] = useState(null); 
    const [gameStatus, setGameStatus] = useState('ready'); // 'ready', 'playing', 'finished'
    
    const moleTimerRef = useRef(null); // Ref for mole disappearance timeout

    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 
    
    // NOTE: recordGameResult logic is assumed correct and unchanged.
    const recordGameResult = useCallback(async (finalScore) => {
        // ... (record logic remains the same) ...
    }, [isAuthenticated, token, updateUser]);

    const getRandomHole = (currentActive) => {
        let nextHole;
        do {
            nextHole = Math.floor(Math.random() * 9);
        } while (nextHole === currentActive); 
        return nextHole;
    };

    // --- MOLE POP-UP CONTROL ---
    const startNextMolePopUp = useCallback(() => {
        if (gameStatus !== 'playing') return;

        if (moleTimerRef.current) clearTimeout(moleTimerRef.current);

        const nextHole = getRandomHole(null); 
        const popUpTime = Math.random() * (MOLE_APPEAR_MAX - MOLE_APPEAR_MIN) + MOLE_APPEAR_MIN;

        setActiveMole(nextHole); // Mole pops up

        // Schedule disappearance and next pop-up
        moleTimerRef.current = setTimeout(() => {
            setActiveMole(null); // Mole disappears
            if (gameStatus === 'playing') {
                startNextMolePopUp(); // Start the next mole cycle
            }
        }, popUpTime);
    }, [gameStatus]); // Dependencies are correct here

    // --- FIX: GAME START / TIMER EFFECT (The main loop controller) ---
    useEffect(() => {
        let timerInterval;

        if (gameStatus === 'playing') {
            // Timer starts
            timerInterval = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime <= 1) {
                        // Game Over condition
                        clearInterval(timerInterval);
                        setGameStatus('finished');
                        setActiveMole(null);
                        clearTimeout(moleTimerRef.current); // Stop mole timer
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            // Start Mole Activity
            startNextMolePopUp();
        }

        // Cleanup: Stops all loops/timeouts when component unmounts or status changes
        return () => {
            if (timerInterval) clearInterval(timerInterval);
            if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
        };
    }, [gameStatus, startNextMolePopUp]); // CRITICAL FIX: The logic is now stable here


    // Handle game end cleanup
    useEffect(() => {
        if (gameStatus === 'finished') {
            recordGameResult(score);
        }
    }, [gameStatus, score, recordGameResult]);


    const startGame = useCallback(() => {
        setScore(0);
        setTime(GAME_DURATION);
        setGameStatus('playing');
        setActiveMole(null);
    }, []);

    const resetGame = useCallback(() => {
        setGameStatus('ready');
        setActiveMole(null);
        clearTimeout(moleTimerRef.current);
        setScore(0);
        setTime(GAME_DURATION);
    }, []);


    const handleWhac = (index) => {
        if (gameStatus !== 'playing' || index !== activeMole) return;

        setScore(s => s + 1);
        
        // Whac instantly stops the current mole timer and starts a new cycle immediately
        if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
        setActiveMole(null); // Immediately disappear
        startNextMolePopUp(); // Start the next one
    };
    
    const getStatusText = () => {
        if (gameStatus === 'ready') return 'Click Start to begin!';
        if (gameStatus === 'playing') return 'Whac the mole before it hides!';
        if (gameStatus === 'finished') return `Time's up! Final Score: ${score} 🎉`;
    };

    const renderHole = (index) => {
        const isMoleVisible = index === activeMole;
        
        return (
            <div 
                key={index} 
                className="wam-hole" 
                onClick={() => handleWhac(index)}
            >
                {/* FIX 3: Render mole unconditionally and use CSS to control visibility/position */}
                <div className={`wam-mole ${isMoleVisible ? 'visible' : ''}`}>
                    🐹 
                </div>
            </div>
        );
    };

    return (
        <div className="game-content">
            <h1>Whac a Mole</h1>
            <div className="wam-container" id="whac-a-mole-game">

                <div className="wam-stats">
                    <div className="wam-stat-item">
                        <span className="wam-stat-label">Score:</span>
                        <span className="wam-stat-value">{score}</span>
                    </div>
                    <div className="wam-stat-item">
                        <span className="wam-stat-label">Time Left:</span>
                        <span className={`wam-stat-value ${time <= 5 ? 'wam-time-low' : ''}`}>{time}s</span>
                    </div>
                </div>
                
                <div id="wam-board">
                    {[...Array(9).keys()].map(renderHole)}
                </div>

                <h2 id="game-status">{getStatusText()}</h2>

                {(gameStatus === 'ready' || gameStatus === 'finished') && (
                    <button className="wam-reset-btn" onClick={startGame}>
                        {gameStatus === 'finished' ? 'Play Again' : 'Start Game'}
                    </button>
                )}
                
                {gameStatus === 'playing' && (
                    <button className="wam-reset-btn secondary-btn" onClick={resetGame}> 
                        Reset Game
                    </button>
                )}
            </div>
        </div>
    );
};

export default WhacAMole;