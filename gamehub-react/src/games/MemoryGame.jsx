// src/games/MemoryGame.jsx

import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/memory-game.css'; 

const cardIcons = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
const GAME_ID = 'memory';

const initializeCards = () => {
  let cards = [...cardIcons, ...cardIcons]
    .map((icon, index) => ({
      id: index,
      icon,
      isFlipped: false,
      isMatched: false,
    }))
    .sort(() => Math.random() - 0.5); 
  return cards;
};

function MemoryGame() {
  const [cards, setCards] = useState(initializeCards);
  const [flippedCards, setFlippedCards] = useState([]); 
  const [canFlip, setCanFlip] = useState(true);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [time, setTime] = useState(0);
  const { isAuthenticated, token, updateUser } = useContext(AuthContext); 

  const isGameWon = useMemo(() => cards.every(card => card.isMatched), [cards]);

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
      console.error('MemoryGame: Network error recording result:', error);
    }
  }, [isAuthenticated, token, updateUser, moves]);

  // Timer useEffect
  useEffect(() => {
    let interval = null;
    if (gameStarted && !isGameWon) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (isGameWon) {
        if (interval) clearInterval(interval);
        recordGameResult('win'); 
    }
    return () => { if (interval) clearInterval(interval); };
  }, [gameStarted, isGameWon, recordGameResult]);

  // Logic to check for a match
  useEffect(() => {
    if (flippedCards.length === 2) {
      setCanFlip(false);
      setMoves(m => m + 1);
      
      const [id1, id2] = flippedCards;
      const card1 = cards.find(c => c.id === id1);
      const card2 = cards.find(c => c.id === id2);

      if (card1.icon === card2.icon) {
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(c => 
              c.id === id1 || c.id === id2 ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCards([]);
          setCanFlip(true);
        }, 800);
      } else {
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(c => 
              c.id === id1 || c.id === id2 ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
          setCanFlip(true);
        }, 1200);
      }
    }
  }, [flippedCards, cards]);

  const handleCardClick = useCallback((clickedCard) => {
    if (!canFlip || clickedCard.isFlipped || clickedCard.isMatched || isGameWon) return;
    
    if (!gameStarted) setGameStarted(true);

    setCards(prevCards => 
      prevCards.map(c => 
        c.id === clickedCard.id ? { ...c, isFlipped: true } : c
      )
    );
    setFlippedCards(f => [...f, clickedCard.id]);
  }, [canFlip, gameStarted, isGameWon]);

  const resetGame = useCallback(() => {
    setCards(initializeCards());
    setFlippedCards([]);
    setCanFlip(true);
    setMoves(0);
    setGameStarted(false);
    setTime(0);
  }, []);
  
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="game-content">
      <h1>Memory Game</h1>
      <div className="memory-container" id="memory-game">

        <div className="memory-stats">
            <div className="memory-stat-item">
                <span className="memory-stat-label">Moves:</span>
                <span className="memory-stat-value">{moves}</span>
            </div>
            <div className="memory-stat-item">
                <span className="memory-stat-label">Time:</span>
                <span className="memory-stat-value">{formatTime(time)}</span>
            </div>
        </div>

        {isGameWon && (
            <div className="memory-status-text memory-win-message">
                🎉 Solved in {moves} moves!
            </div>
        )}

        <div className="memory-card-grid">
          {cards.map(card => (
            <div 
              key={card.id} 
              className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
              onClick={() => handleCardClick(card)}
            >
              <div className="memory-card-inner">
                <div className="memory-card-face memory-card-back">?</div>
                <div className="memory-card-face memory-card-front">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <button 
            id="reset-button"
            className="memory-reset-btn" 
            onClick={resetGame}>
            {isGameWon ? 'Play Again' : 'Restart Game'}
        </button>
      </div>
    </div>
  );
}

export default MemoryGame;