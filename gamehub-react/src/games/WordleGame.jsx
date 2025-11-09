// src/games/WordleGame.jsx

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/WordleGame.css';

// --- GAME CONSTANTS ---
const TARGET_WORD = "REACT"; // Example 5-letter word
const MAX_GUESSES = 6;
const GAME_ID = 'wordle';

const INITIAL_GRID = Array(MAX_GUESSES).fill(null).map(() => 
    Array(TARGET_WORD.length).fill({ letter: '', status: 'empty' })
);

// --- HELPER FUNCTION: Check Guess Status ---
const checkGuess = (guess) => {
    const target = TARGET_WORD.toUpperCase().split('');
    const guessLetters = guess.toUpperCase().split('');
    const result = [];
    const targetMap = [...target];

    // Pass 1: Check for correct positions (Green)
    for (let i = 0; i < guessLetters.length; i++) {
        if (guessLetters[i] === target[i]) {
            result[i] = { letter: guessLetters[i], status: 'correct' };
            targetMap[i] = null; // Mark this position as used
        }
    }

    // Pass 2: Check for present (Yellow) and absent (Gray)
    for (let i = 0; i < guessLetters.length; i++) {
        if (!result[i]) { // Only process letters that weren't already marked 'correct'
            const targetIndex = targetMap.indexOf(guessLetters[i]);
            if (targetIndex > -1) {
                result[i] = { letter: guessLetters[i], status: 'present' };
                targetMap[targetIndex] = null; // Mark this letter instance as used
            } else {
                result[i] = { letter: guessLetters[i], status: 'absent' };
            }
        }
    }
    return result;
};


function WordleGame() {
    // --- STATE ---
    const [grid, setGrid] = useState(INITIAL_GRID);
    const [currentGuess, setCurrentGuess] = useState('');
    const [currentRow, setCurrentRow] = useState(0);
    const [status, setStatus] = useState(`Guess the ${TARGET_WORD.length}-letter word.`);
    const [gameActive, setGameActive] = useState(true);

    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 
    
    // --- BACKEND LOGIC ---
    const recordGameResult = useCallback(async (gameResult) => {
        if (!isAuthenticated || !token) return; 

        try {
            const response = await fetch('http://localhost:3001/api/stats/record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ gameId: GAME_ID, result: gameResult, value: gameResult === 'win' ? currentRow + 1 : null }),
            });
            if (response.ok) {
                const successData = await response.json();
                if (successData.user && updateUser) updateUser(successData.user); 
            }
        } catch (error) {
            console.error('Wordle: Network error recording result:', error);
        }
    }, [isAuthenticated, token, updateUser, currentRow]);


    // --- GAME LOGIC: Process Guess (Must be defined first) ---
    const processGuess = useCallback((guess) => {
        const result = checkGuess(guess);
        
        // Update the grid with results
        setGrid(prevGrid => {
            const newGrid = [...prevGrid];
            newGrid[currentRow] = result;
            return newGrid;
        });
        
        // Win Check
        if (guess.toUpperCase() === TARGET_WORD) {
            setStatus(`🎉 You won in ${currentRow + 1} guesses!`);
            setGameActive(false);
            recordGameResult('win');
            return;
        }

        // Loss Check
        if (currentRow >= MAX_GUESSES - 1) {
            setStatus(`😭 Game over! The word was ${TARGET_WORD}.`);
            setGameActive(false);
            recordGameResult('loss');
            return;
        }

        // Continue Game
        setCurrentRow(r => r + 1);
        setCurrentGuess('');
        setStatus("Incorrect. Try again.");
    }, [currentRow, recordGameResult]);


    // --- EFFECT: Handle Keyboard Input ---
    useEffect(() => {
        if (!gameActive) return;

        const handleKeyDown = (e) => {
            const key = e.key.toUpperCase();
            
            if (key === 'ENTER') {
                if (currentGuess.length === TARGET_WORD.length) {
                    processGuess(currentGuess); // <--- Accesses processGuess
                } else {
                    setStatus("Not enough letters!");
                }
            } else if (key === 'BACKSPACE') {
                setCurrentGuess(prev => prev.slice(0, -1));
            } else if (key.length === 1 && key.match(/[A-Z]/)) {
                if (currentGuess.length < TARGET_WORD.length) {
                    setCurrentGuess(prev => prev + key);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentGuess, gameActive, processGuess]); 

    // --- EFFECT: Update Grid for Typing ---
    useEffect(() => {
        const newGrid = grid.map((row, rIdx) => {
            if (rIdx === currentRow) {
                return row.map((cell, cIdx) => ({
                    ...cell,
                    letter: currentGuess[cIdx] || '',
                    status: currentGuess[cIdx] ? 'editing' : 'empty'
                }));
            }
            return row;
        });
        setGrid(newGrid);
    }, [currentGuess, currentRow]);


    const resetGame = () => {
        setGrid(INITIAL_GRID);
        setCurrentGuess('');
        setCurrentRow(0);
        setStatus(`Guess the ${TARGET_WORD.length}-letter word.`);
        setGameActive(true);
    };

    return (
        <div className="game-content">
            <h1>Word Game (Wordle)</h1>
            <div className="wordle-container" id="wordle-game">
                
                <h2 id="game-status">{status}</h2>

                <div className="wordle-grid">
                    {grid.map((row, rIdx) => (
                        <div key={rIdx} className="wordle-row">
                            {row.map((cell, cIdx) => (
                                <div 
                                    key={cIdx} 
                                    className={`wordle-tile ${cell.status}`}
                                >
                                    {cell.letter}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="wordle-keyboard-tip">
                    {gameActive ? "Type on your keyboard (5 letters) or use a virtual one." : `Word: ${TARGET_WORD}`}
                </div>

                <button 
                    id="reset-button"
                    className="wordle-reset-btn" 
                    onClick={resetGame}>
                    {gameActive ? 'Reset Game' : 'Play Again'}
                </button>
            </div>
        </div>
    );
}

export default WordleGame;