// src/games/BubbleShooter.jsx

import React, { useState, useCallback, useMemo, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/BubbleShooter.css';

const GRID_ROWS = 8; // Increased rows slightly for better gameplay
const GRID_COLS = 11; 
const INITIAL_ROWS = 5;
const COLORS = ['red', 'blue', 'green', 'yellow'];
const GAME_ID = 'bubble-shooter';

// Helper to generate a random starting bubble board
const generateInitialBubbles = () => {
    const board = [];
    for (let r = 0; r < GRID_ROWS; r++) {
        const row = [];
        for (let c = 0; c < GRID_COLS; c++) {
            // Only fill the initial rows
            const color = (r < INITIAL_ROWS) ? COLORS[Math.floor(Math.random() * COLORS.length)] : null;
            row.push({ id: `${r}-${c}`, color, isEmpty: (r >= INITIAL_ROWS) });
        }
        board.push(row);
    }
    return board;
};

function BubbleShooter() {
    const [board, setBoard] = useState(generateInitialBubbles);
    const [score, setScore] = useState(0);
    const [nextBubble, setNextBubble] = useState(COLORS[Math.floor(Math.random() * COLORS.length)]);
    const [status, setStatus] = useState("Aim and click to shoot!");
    const [gameActive, setGameActive] = useState(true);

    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 
    
    // --- Helper Functions (Defined inside component for dependency management) ---

    const generateNewNextBubble = () => COLORS[Math.floor(Math.random() * COLORS.length)];

    const getNeighbors = (r, c) => {
        const neighbors = [];
        // Check 8 directions
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue; 
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS) {
                    neighbors.push({ r: nr, c: nc });
                }
            }
        }
        return neighbors;
    };

    const findConnectedMatches = (currentBoard, startR, startC, color) => {
        const matches = [];
        const stack = [{ r: startR, c: startC }];
        const visited = new Set();
    
        while (stack.length > 0) {
            const { r, c } = stack.pop();
            const key = `${r}-${c}`;
    
            // Check bounds, visited, emptiness, and color match
            if (r < 0 || r >= GRID_ROWS || c < 0 || c >= GRID_COLS || visited.has(key) || 
                currentBoard[r][c].isEmpty || currentBoard[r][c].color !== color) 
            {
                continue;
            }
    
            visited.add(key);
            matches.push({ r, c });
    
            getNeighbors(r, c).forEach(neighbor => {
                if (!visited.has(`${neighbor.r}-${neighbor.c}`)) {
                    stack.push(neighbor);
                }
            });
        }
        return matches;
    };

    const findFloatingBubbles = (currentBoard) => {
        // BFS to identify all bubbles still connected to the top row (r=0)
        const connected = new Set();
        const queue = [];
        
        // Start search from all bubbles in the top row
        for (let c = 0; c < GRID_COLS; c++) {
            if (!currentBoard[0][c].isEmpty) {
                queue.push({ r: 0, c });
                connected.add(`0-${c}`);
            }
        }
        
        while (queue.length > 0) {
            const { r, c } = queue.shift();
    
            getNeighbors(r, c).forEach(neighbor => {
                const key = `${neighbor.r}-${neighbor.c}`;
                if (!connected.has(key) && !currentBoard[neighbor.r][neighbor.c].isEmpty) {
                    connected.add(key);
                    queue.push(neighbor);
                }
            });
        }
    
        // Identify bubbles that were NOT connected
        const floating = [];
        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                const key = `${r}-${c}`;
                if (!currentBoard[r][c].isEmpty && !connected.has(key)) {
                    floating.push({ r, c });
                }
            }
        }
    
        return { connected: Array.from(connected), floating };
    };

    // --- Game Logic ---

    const handleShoot = useCallback((e) => {
        if (!gameActive) return;

        let newBoard = board.map(row => [...row]);
        const currentNextBubbleColor = nextBubble;

        // --- 1. SIMULATE COLLISION / FIND TARGET CELL ---
        // CRUDE SIMULATION: Find the lowest empty cell closest to the click location
        
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const targetC = Math.min(GRID_COLS - 1, Math.floor(mouseX / (rect.width / GRID_COLS)));
        
        let startR = -1;
        let startC = targetC;
        
        // Search from bottom up in the target column
        for (let r = GRID_ROWS - 1; r >= 0; r--) {
            if (newBoard[r][targetC].isEmpty) {
                 startR = r;
                 break;
            }
        }
        
        if (startR === -1) {
             setStatus("Column Full! Shoot elsewhere.");
             return;
        }

        // --- 2. PLACE THE BUBBLE ---
        newBoard[startR][startC] = { id: `${startR}-${startC}`, color: currentNextBubbleColor, isEmpty: false };
        let points = 1; // Base point for placing a bubble

        // --- 3. CHECK FOR MATCHES ---
        const matches = findConnectedMatches(newBoard, startR, startC, currentNextBubbleColor);
        
        if (matches.length >= 3) {
            // --- 4. CLEAR MATCHES ---
            matches.forEach(({ r, c }) => {
                newBoard[r][c] = { isEmpty: true, color: null, id: `${r}-${c}` };
                points += 10;
            });

            // --- 5. CHECK FOR FLOATING BUBBLES ---
            const { floating } = findFloatingBubbles(newBoard);
            
            floating.forEach(({ r, c }) => {
                newBoard[r][c] = { isEmpty: true, color: null, id: `${r}-${c}` };
                points += 25; // Bonus points
            });
            
            // --- 6. UPDATE STATE AND SCORE ---
            setBoard(newBoard);
            setScore(s => s + points);
            setStatus(`Popped ${matches.length} bubbles! (${floating.length} fell!)`);
            
            // Check Lose Condition (simplified: bubble placed in the top two rows)
             if (startR <= 1) { 
                setStatus("GAME OVER! Lines too high.");
                setGameActive(false);
                // recordGameResult(score + points);
            }
            
            // Check Win Condition
            if (newBoard.flat().every(b => b.isEmpty)) {
                setStatus("YOU WIN! 🎉");
                setGameActive(false);
                // recordGameResult(score + points);
            }

        } else {
            // No match, just place the bubble
            setBoard(newBoard);
            setScore(s => s + points); // Still get 1 point for a shot
            setStatus("No match, keep shooting!");

            // Check Lose Condition if placed too high without clearing
             if (startR <= 0) { 
                setStatus("GAME OVER! Line reached.");
                setGameActive(false);
            }
        }

        // --- 7. NEXT TURN SETUP ---
        setNextBubble(generateNewNextBubble());
        
    }, [gameActive, board, nextBubble]);


    const resetGame = () => {
        setBoard(generateInitialBubbles());
        setScore(0);
        setNextBubble(generateNewNextBubble());
        setStatus("Aim and click to shoot!");
        setGameActive(true);
    };

    return (
        <div className="game-content">
            <h1>Bubble Shooter</h1>
            <div className="bs-container" id="bubble-shooter-game">
                
                <div className="bs-stats">
                    <span className="bs-stat-label">Score: {score}</span>
                </div>

                {/* CRITICAL: Attach handleShoot to the board wrapper */}
                <div id="bs-board-wrapper" onClick={gameActive ? handleShoot : undefined}> 
                    <div id="bs-board">
                        {board.map((row, r) => (
                            <div key={r} className="bs-row">
                                {row.map((bubble, c) => (
                                    <div
                                        key={bubble.id}
                                        // Use style prop to dynamically control color based on board state
                                        style={{ backgroundColor: bubble.color }}
                                        className={`bs-bubble ${bubble.isEmpty ? 'empty' : ''}`}
                                    >
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bs-shooter-area">
                    <h2 id="game-status">{status}</h2>
                    <div className="bs-next-bubble-wrapper">
                        <span className="bs-next-label">Next:</span>
                        <div style={{ backgroundColor: nextBubble }} className="bs-next-bubble"></div>
                    </div>
                </div>

                <button 
                    id="reset-button"
                    className="bs-reset-btn" 
                    onClick={resetGame}>
                    Restart Game
                </button>
            </div>
        </div>
    );
}

export default BubbleShooter;