// src/games/Snake.jsx

import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/Snake.css';

// Game Constants
const GRID_SIZE = 20;
const INITIAL_SPEED = 200; 
const GAME_ID = 'snake';
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 }; 

const generateFood = (snake) => {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

const Snake = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  // FIX 1: Introduce gameActive state, initialized to false (stopped)
  const [gameActive, setGameActive] = useState(false); 

  const directionRef = useRef(direction);
  directionRef.current = direction; 

  const { isAuthenticated, token, updateUser } = useContext(AuthContext); 
  
  const recordGameResult = useCallback(async (finalScore) => {
    if (!isAuthenticated || !token || finalScore <= 0) return; 

    try {
      const response = await fetch('http://localhost:3001/api/stats/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ gameId: GAME_ID, result: 'score', value: finalScore }),
      });

      if (response.ok) {
        const successData = await response.json();
        if (successData.user && updateUser) updateUser(successData.user); 
      }
    } catch (error) {
      console.error('Snake: Network error recording result:', error);
    }
  }, [isAuthenticated, token, updateUser]);


  // FIX 2: Only run the game loop if gameActive is true
  useEffect(() => {
    if (!gameActive || isGameOver) { // Check gameActive
      if (isGameOver) recordGameResult(score);
      return;
    }
    
    const interval = setInterval(() => {
      setSnake(prevSnake => {
        // ... (Game logic remains the same) ...
        const newSnake = [...prevSnake];
        const head = newSnake[0];
        const newHead = { 
          x: head.x + directionRef.current.x, 
          y: head.y + directionRef.current.y 
        };

        const isWallCollision = newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE;
        const isSelfCollision = newSnake.some((segment, index) => index > 0 && segment.x === newHead.x && segment.y === newHead.y);

        if (isWallCollision || isSelfCollision) {
          setIsGameOver(true);
          clearInterval(interval);
          return prevSnake; 
        }

        newSnake.unshift(newHead);

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 1);
          setFood(generateFood(newSnake));
          setSpeed(s => Math.max(80, s - 5)); 
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  // FIX 3: Add gameActive to dependencies
  }, [gameActive, isGameOver, food, speed, score, recordGameResult]);

  // Input handling hook
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isGameOver) return;
      // FIX 4: If game is not active, treat arrow key press as START
      if (!gameActive) {
          if (e.key.startsWith('Arrow')) {
              startGame();
          }
      }
      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  // FIX 5: Add gameActive to dependencies
  }, [isGameOver, gameActive]); 

  const handleTouchControl = (newDir) => {
    if (isGameOver) return;
    // FIX 6: If game is not active, clicking a touch control button starts the game
    if (!gameActive) startGame(); 

    const currentDir = directionRef.current;
    if (newDir.x === -currentDir.x || newDir.y === -currentDir.y) return; 
    setDirection(newDir);
  };

  // FIX 7: Dedicated startGame function to reset state AND set gameActive=true
  const startGame = useCallback(() => {
    if (isGameOver) {
        // Only reset state if restarting from Game Over
        setSnake(INITIAL_SNAKE);
        setFood(generateFood(INITIAL_SNAKE));
        setDirection(INITIAL_DIRECTION);
        setIsGameOver(false);
        setScore(0);
        setSpeed(INITIAL_SPEED);
    }
    setGameActive(true);
  }, [isGameOver]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameActive(false); // Stop the game loop
  };

  const renderGrid = () => {
    // ... (renderGrid logic remains the same) ...
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        let className = 'snake-grid-cell';
        
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        if (isSnake) {
          const isHead = snake[0].x === x && snake[0].y === y;
          className += isHead ? ' snake-head' : ' snake-body';
        }
        
        if (food.x === x && food.y === y) {
          className += ' snake-food';
        }

        cells.push(<div key={`${x}-${y}`} className={className}></div>);
      }
    }
    return cells;
  };

  const getStatusText = () => {
    if (isGameOver) return `Game Over! Final Score: ${score} 💥`;
    if (!gameActive && score === 0) return 'Press Start or use keyboard arrows to move.';
    if (!gameActive && score > 0) return 'Game Paused. Click Start.';
    return `Score: ${score}`;
  };

  return (
    <div className="game-content">
      <h1>Snake</h1>
      <div className="snake-container" id="snake-game">
        
        <div className="snake-stats">
            <span className="snake-stat-label">Score: {score}</span>
            <span className="snake-stat-label">Speed: {Math.floor(200 / speed * 10)}</span>
        </div>

        {/* FIX 8: Render Game Status */}
        <h2 id="game-status">{getStatusText()}</h2>

        <div 
          id="snake-board"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {renderGrid()}
        </div>
        
        {/* Mobile/Touch Controls */}
        <div className="snake-touch-controls">
            <button className="snake-control-btn up" onClick={() => handleTouchControl({ x: 0, y: -1 })}>▲</button>
            <div className="snake-horizontal-controls">
                <button className="snake-control-btn left" onClick={() => handleTouchControl({ x: -1, y: 0 })}>◀</button>
                <button className="snake-control-btn right" onClick={() => handleTouchControl({ x: 1, y: 0 })}>▶</button>
            </div>
            <button className="snake-control-btn down" onClick={() => handleTouchControl({ x: 0, y: 1 })}>▼</button>
        </div>
        
        {/* FIX 9: Conditional buttons for Start/Pause/Reset */}
        {gameActive && !isGameOver ? (
             <button 
                id="pause-button"
                className="snake-reset-btn secondary-btn" 
                onClick={resetGame}> {/* Reset button stops the game */}
                Pause Game
            </button>
        ) : (
            <button 
                id="start-button"
                className="snake-reset-btn" 
                onClick={startGame}>
                {isGameOver ? 'Play Again' : 'Start Game'}
            </button>
        )}
      </div>
    </div>
  );
};

export default Snake;