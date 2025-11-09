// src/games/ConnectFour.jsx

import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react'; 
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/ConnectFour.css';

const ROWS = 6;
const COLS = 7;
const GAME_ID = 'connect-four';

const initialBoard = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

// Helper: Check for 4 in a row 
const checkWin = (board) => {
    const directions = [
        [[0, 1], [0, 2], [0, 3]], // Horizontal
        [[1, 0], [2, 0], [3, 0]], // Vertical
        [[1, 1], [2, 2], [3, 3]], // Diagonal \
        [[1, -1], [2, -2], [3, -3]] // Diagonal /
    ];

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const player = board[r][c];
            if (!player) continue;

            for (const dir of directions) {
                let count = 0;
                let isWin = true;
                for (const [dr, dc] of dir) {
                    const nr = r + dr;
                    const nc = c + dc;

                    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === player) {
                        count++;
                    } else {
                        isWin = false;
                        break;
                    }
                }
                if (isWin && count === 3) return player; 
            }
        }
    }
    return null;
};

function ConnectFour() {
    const [board, setBoard] = useState(initialBoard);
    const [currentPlayer, setCurrentPlayer] = useState('red');
    const [gameActive, setGameActive] = useState(true);
    const [status, setStatus] = useState("Red's turn");
    const [lastDropped, setLastDropped] = useState(null); 

    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 
    
    const winner = useMemo(() => checkWin(board), [board]); 
    const isDraw = useMemo(() => !winner && board.every(row => row.every(cell => cell !== null)), [winner, board]);

    const recordGameResult = useCallback(async (gameResult) => {
        if (!isAuthenticated || !token) return; 

        try {
            const response = await fetch('http://localhost:3001/api/stats/record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ gameId: GAME_ID, result: gameResult }),
            });
            if (response.ok) {
                const successData = await response.json();
                if (successData.user && updateUser) updateUser(successData.user); 
            }
        } catch (error) {
            console.error('ConnectFour: Network error recording result:', error);
        }
    }, [isAuthenticated, token, updateUser]);


    useEffect(() => { 
        if (winner) {
            setStatus(`🎉 ${winner.toUpperCase()} Wins!`);
            setGameActive(false);
            recordGameResult(winner === 'red' ? 'win' : 'loss'); 
        } else if (isDraw) {
            setStatus("🤝 It's a Draw!");
            setGameActive(false);
            recordGameResult('draw');
        } else if (gameActive) {
            setStatus(`${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`);
        }
    }, [winner, isDraw, currentPlayer, gameActive, recordGameResult]);


    const handleDrop = useCallback((col) => {
        if (!gameActive || winner) return;

        let newBoard = board.map(row => [...row]); 
        let rowToDrop = -1;

        for (let r = ROWS - 1; r >= 0; r--) {
            if (newBoard[r][col] === null) {
                rowToDrop = r;
                break;
            }
        }

        if (rowToDrop !== -1) {
            newBoard[rowToDrop][col] = currentPlayer;
            setBoard(newBoard);
            setLastDropped({ r: rowToDrop, c: col }); 
            setCurrentPlayer(prev => prev === 'red' ? 'yellow' : 'red');
        }

    }, [gameActive, winner, board, currentPlayer]);

    const resetGame = () => {
        setBoard(initialBoard);
        setCurrentPlayer('red');
        setGameActive(true);
        setStatus("Red's turn");
        setLastDropped(null);
    };
    
    const renderChip = (cell, index) => {
        const r = Math.floor(index / COLS);
        const c = index % COLS;
        const shouldAnimate = lastDropped && lastDropped.r === r && lastDropped.c === c;

        return (
            <div key={index} className="c4-cell">
                <div 
                    className={`c4-chip ${cell || 'empty'}`} 
                    // Animation is triggered only for the dropped chip
                    style={{ animation: shouldAnimate ? 'drop-chip 0.5s forwards ease-in' : 'none' }} 
                ></div>
            </div>
        );
    };


    return (
        <div className="game-content">
            <h1 className="c4-title">Connect Four</h1>
            <div className="c4-container" id="connect-four-game">
                
                <div className="c4-status-wrapper">
                    <div className={`c4-indicator-chip ${currentPlayer}`}></div>
                    <h2 id="game-status" className={`c4-status ${currentPlayer}`}>{status}</h2>
                </div>

                <div className="c4-board-wrapper">
                    {/* DROP BUTTONS - Empty clickable zones */}
                    <div className="c4-drop-area">
                        {[...Array(COLS)].map((_, colIndex) => (
                            <button 
                                key={colIndex} 
                                className={`c4-drop-button ${currentPlayer}`} 
                                onClick={() => handleDrop(colIndex)} 
                                disabled={!gameActive || winner || board[0][colIndex] !== null}
                            >
                                {/* Content is empty */}
                            </button>
                        ))}
                    </div>

                    {/* BOARD */}
                    <div id="c4-board" style={{ 
                        gridTemplateColumns: `repeat(${COLS}, 1fr)`, 
                        gridTemplateRows: `repeat(${ROWS}, 1fr)` 
                    }}>
                        {board.flat().map(renderChip)}
                    </div>
                </div>

                <button 
                    id="reset-button"
                    className="c4-reset-btn" 
                    onClick={resetGame}>
                    {winner || isDraw ? 'Play Again' : 'Reset Game'}
                </button>
            </div>
        </div>
    );
}

export default ConnectFour;