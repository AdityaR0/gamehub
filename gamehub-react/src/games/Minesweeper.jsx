// src/games/Minesweeper.jsx

import React, { useState, useCallback, useEffect, useMemo, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/Minesweeper.css';

const ROWS = 8;
const COLS = 8;
const MINES = 10;
const GAME_ID = 'minesweeper';

const initializeBoard = (startR, startC) => {
    let board = Array(ROWS).fill(null).map(() => Array(COLS).fill({ isMine: false, isRevealed: false, isFlagged: false, count: 0 }));
    let minePositions = [];

    // Place Mines
    while (minePositions.length < MINES) {
        const r = Math.floor(Math.random() * ROWS);
        const c = Math.floor(Math.random() * COLS);

        // Ensure mine is not placed on the starting click or adjacent cells
        if (Math.abs(r - startR) > 1 || Math.abs(c - startC) > 1) {
            if (!board[r][c].isMine) {
                board[r][c] = { ...board[r][c], isMine: true };
                minePositions.push({ r, c });
            }
        }
    }

    // Calculate surrounding mine counts
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (!board[r][c].isMine) {
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].isMine) {
                            count++;
                        }
                    }
                }
                board[r][c] = { ...board[r][c], count: count };
            }
        }
    }
    return board;
};

// Depth-first search to reveal empty areas
const revealEmptyCells = (board, r, c) => {
    const newBoard = board.map(row => [...row]);
    const stack = [{ r, c }];

    while (stack.length > 0) {
        const { r: currentR, c: currentC } = stack.pop();

        if (currentR < 0 || currentR >= ROWS || currentC < 0 || currentC >= COLS) continue;
        if (newBoard[currentR][currentC].isRevealed || newBoard[currentR][currentC].isMine) continue;
        
        newBoard[currentR][currentC] = { ...newBoard[currentR][currentC], isRevealed: true };

        if (newBoard[currentR][currentC].count === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr !== 0 || dc !== 0) {
                        stack.push({ r: currentR + dr, c: currentC + dc });
                    }
                }
            }
        }
    }
    return newBoard;
};


function Minesweeper() {
    const [board, setBoard] = useState([]);
    const [gameStatus, setGameStatus] = useState('ready'); // 'ready', 'playing', 'won', 'lost'
    const [mineCount, setMineCount] = useState(MINES);
    const [time, setTime] = useState(0);

    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 

    const isWin = useMemo(() => {
        if (gameStatus !== 'playing') return false;
        const totalCells = ROWS * COLS;
        const revealedCells = board.flat().filter(cell => cell.isRevealed).length;
        return (revealedCells === totalCells - MINES);
    }, [board, gameStatus]);
    
    useEffect(() => {
        if (isWin) {
            setGameStatus('won');
            recordGameResult('win', time);
        }
    }, [isWin]);


    // Timer logic
    useEffect(() => {
        let timerInterval;
        if (gameStatus === 'playing') {
            timerInterval = setInterval(() => {
                setTime(t => t + 1);
            }, 1000);
        } else if (timerInterval) {
            clearInterval(timerInterval);
        }
        return () => clearInterval(timerInterval);
    }, [gameStatus]);

    const recordGameResult = useCallback(async (result, finalTime) => {
        if (!isAuthenticated || !token) return; 

        try {
            const response = await fetch('http://localhost:3001/api/stats/record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ gameId: GAME_ID, result: result, value: finalTime }),
            });
            if (response.ok) {
                const successData = await response.json();
                if (successData.user && updateUser) updateUser(successData.user); 
            }
        } catch (error) {
            console.error('Minesweeper: Network error recording result:', error);
        }
    }, [isAuthenticated, token, updateUser]);

    const handleLeftClick = useCallback((r, c) => {
        if (gameStatus === 'won' || gameStatus === 'lost' || board[r][c].isFlagged) return;

        let newBoard = board.map(row => [...row]);

        // First click setup
        if (gameStatus === 'ready') {
            newBoard = initializeBoard(r, c);
            setGameStatus('playing');
        }
        
        // Mine hit
        if (newBoard[r][c].isMine) {
            setGameStatus('lost');
            newBoard[r][c] = { ...newBoard[r][c], isRevealed: true }; // Show the mine
            setBoard(newBoard);
            recordGameResult('loss', time);
            return;
        }

        // Reveal cell(s)
        if (newBoard[r][c].count === 0) {
            newBoard = revealEmptyCells(newBoard, r, c);
        } else {
            newBoard[r][c] = { ...newBoard[r][c], isRevealed: true };
        }
        
        setBoard(newBoard);
    }, [board, gameStatus, time, recordGameResult]);

    const handleRightClick = useCallback((e, r, c) => {
        e.preventDefault();
        if (gameStatus !== 'playing' || board[r][c].isRevealed) return;

        const newBoard = board.map(row => [...row]);
        const isFlagged = !newBoard[r][c].isFlagged;
        
        newBoard[r][c] = { ...newBoard[r][c], isFlagged: isFlagged };
        setMineCount(prev => isFlagged ? prev - 1 : prev + 1);
        setBoard(newBoard);
    }, [board, gameStatus]);


    const resetGame = () => {
        setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill({ isMine: false, isRevealed: false, isFlagged: false, count: 0 })));
        setGameStatus('ready');
        setMineCount(MINES);
        setTime(0);
    };
    
    const getStatusEmoji = () => {
        if (gameStatus === 'lost') return '😵';
        if (gameStatus === 'won') return '😎';
        return '🙂';
    };

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="game-content">
            <h1>Minesweeper</h1>
            <div className="ms-container" id="minesweeper-game">
                
                <div className="ms-stats">
                    <span className="ms-stat-label ms-mines">💣 {mineCount}</span>
                    <button className="ms-reset-btn ms-face" onClick={resetGame}>
                        {getStatusEmoji()}
                    </button>
                    <span className="ms-stat-label ms-timer">⏱️ {formatTime(time)}</span>
                </div>

                <div id="ms-board" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
                    {board.map((row, r) => (
                        row.map((cell, c) => (
                            <div
                                key={`${r}-${c}`}
                                className={`ms-cell ${cell.isRevealed ? 'ms-revealed' : ''} ${cell.isMine && gameStatus === 'lost' ? 'ms-mine-hit' : ''}`}
                                onClick={() => handleLeftClick(r, c)}
                                onContextMenu={(e) => handleRightClick(e, r, c)}
                            >
                                {cell.isRevealed ? (
                                    cell.isMine ? '💥' : (cell.count > 0 ? cell.count : '')
                                ) : (
                                    cell.isFlagged ? '🚩' : ''
                                )}
                            </div>
                        ))
                    ))}
                </div>

                <h2 id="game-status" className="ms-game-status">
                    {gameStatus === 'lost' ? 'Game Over!' : gameStatus === 'won' ? 'You Won!' : 'Find the mines!'}
                </h2>
            </div>
        </div>
    );
}

export default Minesweeper;