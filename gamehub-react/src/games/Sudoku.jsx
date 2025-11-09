// src/games/Sudoku.jsx

import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react'; // FIXED IMPORT
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/Sudoku.css';

const GAME_ID = 'sudoku';
// ... (EASY_PUZZLE and helper functions getInitialBoard, isValid, isSolved remain the same) ...

const EASY_PUZZLE = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];
// ... (Helper functions remain the same) ...

const getInitialBoard = () => {
    return EASY_PUZZLE.map((row, r) => 
        row.map((val, c) => ({
            value: val,
            isFixed: val !== 0,
            isError: false,
        }))
    );
};

const isValid = (board, r, c, val) => {
    for (let i = 0; i < 9; i++) {
        if (board[r][i].value === val && i !== c) return false;
        if (board[i][c].value === val && i !== r) return false;
    }
    const startRow = Math.floor(r / 3) * 3;
    const startCol = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j].value === val && (startRow + i !== r || startCol + j !== c)) return false;
        }
    }
    return true;
};

const isSolved = (board) => {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c].value === 0) return false;
            if (!isValid(board, r, c, board[r][c].value)) return false;
        }
    }
    return true;
};

function Sudoku() {
    const [board, setBoard] = useState(getInitialBoard);
    const [selectedCell, setSelectedCell] = useState(null); 
    const [status, setStatus] = useState("Enter numbers 1-9.");
    const [gameActive, setGameActive] = useState(true);

    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 
    
    const isCompleted = useMemo(() => isSolved(board), [board]);

    const recordGameResult = useCallback(async (gameResult) => {
        if (!isAuthenticated || !token) return; 
        // ... (record logic, similar to TicTacToe) ...
    }, [isAuthenticated, token, updateUser]);


    useEffect(() => { // FIXED: useEffect is now available
        if (isCompleted && gameActive) {
            setStatus("🎉 Puzzle Solved!");
            setGameActive(false);
            recordGameResult('win');
        }
    }, [isCompleted, gameActive, recordGameResult]);


    const handleCellClick = useCallback((r, c) => {
        if (!gameActive) return;
        setSelectedCell({ r, c });
        setStatus("Enter numbers 1-9.");
    }, [gameActive]);

    const handleNumberInput = useCallback((num) => {
        if (!selectedCell || board[selectedCell.r][selectedCell.c].isFixed || !gameActive) return;

        const { r, c } = selectedCell;
        const value = num === 0 ? 0 : parseInt(num); 

        // Deep copy and update the value
        const newBoard = board.map((row, rIdx) => 
            row.map((cell, cIdx) => (rIdx === r && cIdx === c) ? { ...cell, value: value } : cell)
        );

        const isCurrentlyValid = value === 0 || isValid(newBoard, r, c, value);
        
        newBoard[r][c].isError = !isCurrentlyValid;
        
        setBoard(newBoard);
        if (!isCurrentlyValid && value !== 0) {
            setStatus("❌ Invalid move! Check the row, column, or 3x3 box.");
        } else if (value !== 0) {
            setStatus("Good move. Keep going!");
        } else {
            setStatus("Cell cleared.");
        }

    }, [selectedCell, board, gameActive]);

    const handleReset = () => {
        setBoard(getInitialBoard());
        setSelectedCell(null);
        setStatus("Enter numbers 1-9.");
        setGameActive(true);
    };

    return (
        <div className="game-content">
            <h1>Sudoku</h1>
            <div className="sudoku-container" id="sudoku-game">

                <div className="sudoku-stats">
                    <span className="sudoku-stat-label">{gameActive ? "Easy Puzzle" : "Completed"}</span>
                </div>

                <div id="sudoku-board">
                    {board.map((row, r) => (
                        row.map((cell, c) => (
                            <div
                                key={`${r}-${c}`}
                                className={`sudoku-cell 
                                    ${cell.isFixed ? 'fixed' : ''}
                                    ${selectedCell && selectedCell.r === r && selectedCell.c === c ? 'selected' : ''}
                                    ${Math.floor(r / 3) % 2 === Math.floor(c / 3) % 2 ? 'box-odd' : 'box-even'}
                                    ${cell.isError ? 'error' : ''}
                                    ${cell.value === 0 ? 'empty' : ''}
                                `}
                                onClick={() => handleCellClick(r, c)}
                            >
                                {cell.value !== 0 ? cell.value : ''}
                            </div>
                        ))
                    ))}
                </div>

                <h2 id="game-status" className="sudoku-game-status">{status}</h2>
                
                <div className="sudoku-controls">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button 
                            key={num} 
                            className="sudoku-num-btn"
                            onClick={() => handleNumberInput(num)}>
                            {num}
                        </button>
                    ))}
                    <button className="sudoku-num-btn clear-btn" onClick={() => handleNumberInput(0)}>C</button>
                </div>

                <button 
                    id="reset-button"
                    className="sudoku-reset-btn" 
                    onClick={handleReset}>
                    Reset Puzzle
                </button>
            </div>
        </div>
    );
}

export default Sudoku;