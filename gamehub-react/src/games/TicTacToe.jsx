import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 

import '../assets/css/tic-tac-toe.css'; 

// Define winning combinations
const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Define a unique ID for this game
const GAME_ID = 'tic-tac-toe';

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameActive, setGameActive] = useState(true);
  const [status, setStatus] = useState("Player X's turn");

  // Get authentication status, token, and the updateUser function
  const { isAuthenticated, token, updateUser } = useContext(AuthContext); 

  // Function to send the game result to the backend server
  const recordGameResult = async (result) => {
    if (!isAuthenticated || !token) {
      console.log("TicTacToe: User not authenticated or no token, skipping record.");
      return; 
    }

    try {
      const response = await fetch('http://localhost:3001/api/stats/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gameId: GAME_ID, result: result }),
      });

      console.log(`TicTacToe: Server response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('TicTacToe: Error recording game result:', errorData.message);
      } else {
        const successData = await response.json();
        console.log('TicTacToe: Game result recorded successfully! Updating context.');
        
        // This ensures your profile component gets the refreshed user data (including stats)
        if (successData.user && updateUser) {
            updateUser(successData.user); 
        }
      }

    } catch (error) {
      console.error('TicTacToe: Network error recording game result:', error);
    }
  };


  // Function to handle clicking on a cell
  const handleCellClick = (index) => {
    if (board[index] !== "" || !gameActive) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    // --- Check for a Winner ---
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
      const [aIdx, bIdx, cIdx] = winningConditions[i];
      const a = newBoard[aIdx];
      const b = newBoard[bIdx];
      const c = newBoard[cIdx];
      if (a && a === b && a === c) { 
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      setStatus(`Player ${currentPlayer} has won! 🎉`);
      setGameActive(false);
      recordGameResult('win');
      return; 
    }

    // --- Check for a Draw ---
    const roundDraw = !newBoard.includes("");
    if (roundDraw) {
      setStatus("Game ended in a draw! 🤝");
      setGameActive(false);
      recordGameResult('draw');
      return; 
    }

    // --- If game continues, switch player ---
    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);
    setStatus(`Player ${nextPlayer}'s turn`);
  };

  // Function to reset the game board and state
  const handleResetGame = () => {
    setGameActive(true);
    setCurrentPlayer('X');
    setBoard(Array(9).fill(""));
    setStatus("Player X's turn");
  };

  // Helper to render 'X' or 'O' in the cell
  const renderCellContent = (value) => {
    if (value === 'X') return 'X';
    if (value === 'O') return 'O';
    return null; 
  };

  // --- JSX structure for the game component ---
  return (
    <div className="game-content">
      <h1>Tic-Tac-Toe</h1>
      <div className="game-container" id="tic-tac-toe-game">

        <div id="tic-tac-toe-board">
          {board.map((cellValue, index) => (
            <div
              key={index}
              className={`game-cell ${cellValue.toLowerCase()}`}
              data-cell-index={index}
              onClick={() => handleCellClick(index)}
            >
              {renderCellContent(cellValue)}
            </div>
          ))}
        </div>

        {/* Display the current game status message */}
        <h2 id="game-status">{status}</h2>

        {/* Button to reset the game */}
        <button
          id="reset-button"
          className="game-reset-btn"
          onClick={handleResetGame}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}

export default TicTacToe;