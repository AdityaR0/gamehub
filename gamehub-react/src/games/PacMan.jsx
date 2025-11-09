// src/games/PacMan.jsx

import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/PacMan.css';

const GAME_ID = 'pac-man';
const MAZE_ROWS = 15;
const MAZE_COLS = 15;
const GAME_SPEED = 200; 

// --- MAZE LAYOUTS (1 = Wall, 0 = Path/Dot) ---

// Level 1: Initial Maze
const mazeLayout1 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1], 
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1], 
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1], 
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1], 
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1], // Path fix at [6][5]
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], 
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Path opening at [10][2]
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1], 
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Level 2: More Central Blocks
const mazeLayout2 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1], 
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1], 
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1], 
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1], 
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Level 3: Long Corridors
const mazeLayout3 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const MAZE_COLLECTION = {
    1: mazeLayout1,
    2: mazeLayout2,
    3: mazeLayout3,
};

const findInitialPositions = (maze) => {
    let pacManPos = { r: 5, c: 5 }; 
    let ghostsPos = [{ r: 5, c: 9 }]; 
    let dotCount = 0;

    maze.forEach((row) => {
        row.forEach((cell) => {
            if (cell === 0) dotCount++;
        });
    });
    return { pacManPos, ghostsPos, dotCount };
};

const initialPositions = findInitialPositions(MAZE_COLLECTION[1]);
const resetState = { r: 5, c: 5 }; // Standard reset position

// --- Component Start ---

function PacMan() {
    const [level, setLevel] = useState(1);
    const [maze, setMaze] = useState(MAZE_COLLECTION[1]); 
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameActive, setGameActive] = useState(false);
    const [status, setStatus] = useState("Use Arrows to move Pac-Man!");
    const [pacManPos, setPacManPos] = useState(initialPositions.pacManPos);
    const [ghostsPos, setGhostsPos] = useState(initialPositions.ghostsPos);
    const [direction, setDirection] = useState({ dr: 0, dc: 0 }); 
    const [dotCount, setDotCount] = useState(initialPositions.dotCount);

    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 
    const gameLoopRef = useRef(null);

    const recordGameResult = useCallback(async (finalScore) => { /* ... record logic ... */ }, [isAuthenticated, token, updateUser]);

    const isWall = (r, c) => {
        if (r < 0 || r >= MAZE_ROWS || c < 0 || c >= MAZE_COLS) return true;
        return maze[r][c] === 1;
    };

    const resetLevelPositions = useCallback(() => {
        setPacManPos(resetState);
        setGhostsPos(initialPositions.ghostsPos);
        setDirection({ dr: 0, dc: 0 });
    }, []);
    
    // Helper to calculate state for a new level
    const calculateInitialState = useCallback((mazeToUse) => {
        let dotCount = 0;
        mazeToUse.forEach((row) => {
            row.forEach((cell) => {
                if (cell === 0) dotCount++;
            });
        });
        return { mazeToUse, dotCount };
    }, []);
    
    // --- NEW FUNCTION: Advance to the Next Level (Called by button click) ---
    const advanceLevel = () => {
        const nextLevel = level + 1;
        
        if (nextLevel > Object.keys(MAZE_COLLECTION).length) {
            setGameActive(false);
            setStatus("CONGRATULATIONS! You beat all the mazes! 🎉");
            recordGameResult(score);
            return;
        }
        
        const nextMaze = MAZE_COLLECTION[nextLevel];
        const nextState = calculateInitialState(nextMaze);

        // Reset state for the new level
        setMaze(nextMaze);
        setDotCount(nextState.dotCount);
        setPacManPos(resetState);
        setGhostsPos(initialPositions.ghostsPos);
        setLives(3); // Reset lives for new level
        setLevel(nextLevel);
        setDirection({ dr: 0, dc: 0 }); 
        setGameActive(true); // Manually start the loop
        setStatus(`Level ${nextLevel} Running! Eat the dots.`);
    };

    // --- Movement and Game Logic Tick ---
    const gameTick = useCallback(() => {
        if (!gameActive) return;

        let newPacR = pacManPos.r + direction.dr;
        let newPacC = pacManPos.c + direction.dc;
        let newMaze = maze.map(row => [...row]);
        let newScore = score;
        let newDotCount = dotCount;
        let pacMoved = false;

        // 1. PacMan Movement and Eating Dot
        if (!isWall(newPacR, newPacC)) {
            if (newMaze[newPacR][newPacC] === 0) {
                newScore += 10;
                newDotCount -= 1;
                newMaze[newPacR][newPacC] = 9; // 9 = Empty path
            }
            
            setPacManPos({ r: newPacR, c: newPacC });
            setScore(newScore);
            setDotCount(newDotCount);
            setMaze(newMaze);
            pacMoved = true;
        }

        // 2. Ghost Movement (Simplified AI - Random Movement)
        setGhostsPos(currentGhosts => {
            const nextGhosts = currentGhosts.map(ghost => {
                let directions = [{ dr: 0, dc: 1 }, { dr: 0, dc: -1 }, { dr: 1, dc: 0 }, { dr: -1, dc: 0 }];
                let validMove = false;
                let tries = 0;

                while (!validMove && tries < 4) {
                    const { dr, dc } = directions[Math.floor(Math.random() * 4)];
                    const newGhostR = ghost.r + dr;
                    const newGhostC = ghost.c + dc;

                    if (!isWall(newGhostR, newGhostC)) {
                        validMove = true;
                        return { r: newGhostR, c: newGhostC };
                    }
                    tries++;
                }
                return ghost; 
            });

            return nextGhosts;
        });

        // 3. PacMan vs Ghost Collision
        const checkGhostCollision = (pPos, gPosArray) => {
            return gPosArray.some(g => g.r === pPos.r && g.c === pPos.c);
        };

        if (checkGhostCollision(pacManPos, ghostsPos)) {
            if (lives > 1) {
                setLives(l => l - 1);
                setStatus("Hit! Lives left: " + (lives - 1));
                clearInterval(gameLoopRef.current);
                setGameActive(false); // Stop game loop
                setTimeout(() => {
                    resetLevelPositions();
                    setGameActive(true); // Game resumes after reset
                }, 1000);
            } else {
                setLives(0);
                setGameActive(false);
                setStatus(`GAME OVER! Final Score: ${score}`);
                recordGameResult(score);
            }
        }
        
        // 4. Win Condition Check
        if (newDotCount === 0) {
             setGameActive(false);
             setStatus(`LEVEL ${level} COMPLETE! Click CONTINUE to proceed.`);
             clearInterval(gameLoopRef.current);
             return;
        }

    }, [gameActive, direction, pacManPos, maze, score, lives, dotCount, isWall, resetLevelPositions, ghostsPos, recordGameResult, level]);

    // --- Game Loop Effect and Input Handling ---
    useEffect(() => {
        if (gameActive) {
            gameLoopRef.current = setInterval(gameTick, GAME_SPEED);
            setStatus(`Level ${level} Running! Eat the dots.`);
        } else if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
        }
        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, [gameActive, gameTick]);

    const handleMove = useCallback((e) => {
        if (!gameActive) return;
        let dr = 0, dc = 0;
        switch (e.key) {
            case 'ArrowUp': dr = -1; break;
            case 'ArrowDown': dr = 1; break;
            case 'ArrowLeft': dc = -1; break;
            case 'ArrowRight': dc = 1; break;
            default: return;
        }
        e.preventDefault(); 
        setDirection({ dr, dc }); 
    }, [gameActive]);

    useEffect(() => {
        window.addEventListener('keydown', handleMove);
        return () => window.removeEventListener('keydown', handleMove);
    }, [handleMove]);

    const handleStart = () => {
        const isCompleted = status.includes("COMPLETE");

        if (isCompleted) {
            advanceLevel();
        } else if (!gameActive) {
            const startState = calculateInitialState(MAZE_COLLECTION[1]);
            setMaze(startState.mazeToUse);
            setScore(0);
            setLives(3);
            setPacManPos(resetState);
            setGhostsPos(initialPositions.ghostsPos);
            setDirection({ dr: 0, dc: 0 });
            setDotCount(startState.dotCount);
            setLevel(1);
            setGameActive(true);
        }
    };

    // --- Rendering Logic ---
    const renderCell = (r, c) => {
        let className = 'pm-cell';
        let content = '';

        const cellValue = maze[r][c];
        const isPacMan = pacManPos.r === r && pacManPos.c === c;
        const isGhost = ghostsPos.some(g => g.r === r && g.c === c);

        if (isWall(r, c)) className += ' pm-wall';
        
        if (isPacMan) content = '🟡';
        else if (isGhost) content = '👻';
        else if (cellValue === 0) content = '•'; // Dot

        return (
            <div key={`${r}-${c}`} className={className}>
                {content}
            </div>
        );
    };

    return (
        <div className="game-content">
            <h1>Pac-Man</h1>
            <div className="pm-container" id="pac-man-game">

                <div className="pm-stats">
                    <span className="pm-stat-label">Score: {score}</span>
                    <span className="pm-stat-label">Lives: {'❤️'.repeat(lives)}</span>
                </div>

                <div 
                    id="pm-board" 
                    style={{ gridTemplateColumns: `repeat(${MAZE_COLS}, 1fr)` }}
                >
                    {maze.map((row, r) => (
                        row.map((_, c) => renderCell(r, c))
                    )).flat()}
                </div>

                <h2 id="game-status" className="pm-game-status">{status}</h2>

                <button 
                    id="start-button"
                    className="pm-reset-btn" 
                    onClick={handleStart}>
                    
                    {gameActive ? 'Pause Game' : 
                     status.includes("COMPLETE") ? 'CONTINUE to Level ' + (level + 1) : 
                     'Start Game'}
                </button>
            </div>
        </div>
    );
}

export default PacMan;