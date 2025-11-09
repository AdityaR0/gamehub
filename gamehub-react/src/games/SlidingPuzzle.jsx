// src/games/SlidingPuzzle.jsx

import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/SlidingPuzzle.css';

const GRID_SIZE = 3; 
const BOARD_SIZE = GRID_SIZE * GRID_SIZE; 
const SOLVED_TILES = Array.from({ length: BOARD_SIZE }, (_, i) => i); 
const EMPTY_TILE_INDEX = BOARD_SIZE - 1; 
const GAME_ID = 'puzzle';

const getInitialBoard = () => {
    let tiles = [...SOLVED_TILES];
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    return tiles;
};

function SlidingPuzzle() {
  const [tiles, setTiles] = useState(getInitialBoard);
  const [moves, setMoves] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [status, setStatus] = useState("Click a tile next to the empty space to move.");

  const { isAuthenticated, token, updateUser } = useContext(AuthContext); 

  const isSolved = useMemo(() => tiles.every((tile, index) => tile === SOLVED_TILES[index]), [tiles]);

  const recordGameResult = useCallback(async (gameResult) => {
    if (!isAuthenticated || !token || gameResult !== 'win') return; 

    try {
      const response = await fetch('http://localhost:3001/api/stats/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ gameId: GAME_ID, result: 'win', value: moves }),
      });

      if (response.ok) {
        const successData = await response.json();
        if (successData.user && updateUser) updateUser(successData.user); 
      }
    } catch (error) {
      console.error('Puzzle: Network error recording result:', error);
    }
  }, [isAuthenticated, token, updateUser, moves]);

  useEffect(() => {
    if (isSolved && gameActive) {
      setStatus(`🎉 Solved in ${moves} moves!`);
      setGameActive(false);
      recordGameResult('win');
    }
  }, [isSolved, gameActive, moves, recordGameResult]);


  const isAdjacent = (tileIndex, emptyIndex) => {
    const tileRow = Math.floor(tileIndex / GRID_SIZE);
    const tileCol = tileIndex % GRID_SIZE;
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;

    const rowDiff = Math.abs(tileRow - emptyRow);
    const colDiff = Math.abs(tileCol - emptyCol);

    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  const handleTileClick = useCallback((index) => {
    if (!gameActive || tiles[index] === EMPTY_TILE_INDEX) return;

    const emptyIndex = tiles.indexOf(EMPTY_TILE_INDEX);

    if (isAdjacent(index, emptyIndex)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      
      setTiles(newTiles);
      setMoves(m => m + 1);
      setStatus("Keep sliding!");
    } else {
      setStatus("Invalid move! Try an adjacent tile.");
    }
  }, [gameActive, tiles]);


  const resetGame = useCallback(() => {
    setTiles(getInitialBoard());
    setMoves(0);
    setGameActive(true);
    setStatus("Click a tile next to the empty space to move.");
  }, []);

  return (
    <div className="game-content">
      <h1>Sliding Puzzle (3x3)</h1>
      <div className="puzzle-container" id="sliding-puzzle-game">

        <div className="puzzle-stats">
            <span className="puzzle-stat-label">Moves: {moves}</span>
        </div>

        <div 
          id="puzzle-board"
          className={!gameActive ? 'solved-board' : ''}
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {tiles.map((tileValue, index) => (
            <div
              key={tileValue}
              className={`puzzle-tile ${tileValue === EMPTY_TILE_INDEX ? 'empty-tile' : ''}`}
              onClick={() => handleTileClick(index)}
            >
              {tileValue !== EMPTY_TILE_INDEX ? tileValue + 1 : ''}
            </div>
          ))}
        </div>

        <h2 id="game-status">{status}</h2>

        <button 
          id="reset-button"
          className="puzzle-reset-btn" 
          onClick={resetGame}>
            {isSolved ? 'Start New Puzzle' : 'Reset Puzzle'}
        </button>
      </div>
    </div>
  );
}

export default SlidingPuzzle;