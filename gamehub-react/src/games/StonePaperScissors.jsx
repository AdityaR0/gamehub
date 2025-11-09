// src/games/StonePaperScissors.jsx

import React, { useState, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/StonePaperScissors.css'; 

const choices = [
  { name: 'stone', icon: '🪨' },
  { name: 'paper', icon: '📄' },
  { name: 'scissors', icon: '✂️' },
];

const GAME_ID = 'sps'; 

const getComputerChoice = () => {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
};

const determineWinner = (player, computer) => {
  if (player.name === computer.name) return 'draw';
  if (
    (player.name === 'stone' && computer.name === 'scissors') ||
    (player.name === 'paper' && computer.name === 'stone') ||
    (player.name === 'scissors' && computer.name === 'paper')
  ) {
    return 'win'; 
  }
  return 'loss'; 
};

function StonePaperScissors() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null); 
  const [status, setStatus] = useState("Choose your move to play!");
  const [gameActive, setGameActive] = useState(true);
  const [score, setScore] = useState({ player: 0, computer: 0 });

  const { isAuthenticated, token, updateUser } = useContext(AuthContext); 

  const recordGameResult = useCallback(async (gameResult) => {
    if (!isAuthenticated || !token) return; 

    try {
      const response = await fetch('http://localhost:3001/api/stats/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gameId: GAME_ID, result: gameResult }),
      });

      if (response.ok) {
        const successData = await response.json();
        if (successData.user && updateUser) updateUser(successData.user); 
      }
    } catch (error) {
      console.error('SPS: Network error recording result:', error);
    }
  }, [isAuthenticated, token, updateUser]);


  const handlePlay = useCallback((choice) => {
    if (!gameActive) return; 
    
    setGameActive(false); 

    const compChoice = getComputerChoice();
    const gameResult = determineWinner(choice, compChoice);

    setPlayerChoice(choice);
    setComputerChoice(compChoice);
    setResult(gameResult);
    recordGameResult(gameResult); 

    if (gameResult === 'win') {
      setStatus(`🎉 You win! ${choice.name.toUpperCase()} beats ${compChoice.name.toUpperCase()}.`);
      setScore(s => ({ ...s, player: s.player + 1 }));
    } else if (gameResult === 'loss') {
      setStatus(`😔 Computer wins! ${compChoice.name.toUpperCase()} beats ${choice.name.toUpperCase()}.`);
      setScore(s => ({ ...s, computer: s.computer + 1 }));
    } else {
      setStatus("🤝 It's a draw!");
    }
  }, [gameActive, recordGameResult]);


  const handleResetRound = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setStatus("Choose your move to play!");
    setGameActive(true);
  };

  const handleResetScore = () => {
    handleResetRound();
    setScore({ player: 0, computer: 0 });
  };


  return (
    <div className="game-content">
      <h1>Stone Paper Scissors</h1>
      <div className="sps-container" id="sps-game">
        
        <div className="sps-score-board">
            <span className="sps-score-label">Player: {score.player}</span>
            <span className="sps-score-label">Computer: {score.computer}</span>
        </div>

        <div id="sps-board">
            <div className="sps-choice-area player-area">
                {!playerChoice && (
                    <div className="sps-choice-options">
                        {choices.map((choice) => (
                            <button
                                key={choice.name}
                                className="sps-choice-button"
                                onClick={() => handlePlay(choice)}
                                disabled={!gameActive}
                            >
                                {choice.icon}
                            </button>
                        ))}
                    </div>
                )}
                {playerChoice && (
                    <div className={`sps-final-choice ${result === 'win' ? 'sps-win-highlight' : ''}`}>
                        {playerChoice.icon}
                    </div>
                )}
                <p className="sps-choice-label">You</p>
            </div>

            <div className="sps-separator">VS</div>

            <div className="sps-choice-area computer-area">
                {computerChoice ? (
                    <div className={`sps-final-choice ${result === 'loss' ? 'sps-win-highlight' : ''}`}>
                        {computerChoice.icon}
                    </div>
                ) : (
                    <div className="sps-final-choice sps-waiting-choice">?</div>
                )}
                <p className="sps-choice-label">Computer</p>
            </div>
        </div>

        <h2 id="game-status">{status}</h2>

        {result && (
            <button
              id="next-round-button"
              className="sps-reset-btn primary-btn"
              onClick={handleResetRound}
            >
              Play Next Round
            </button>
        )}
        <button
            id="reset-score-button"
            className="sps-reset-btn secondary-btn"
            onClick={handleResetScore}
        >
            Reset Score
        </button>

      </div>
    </div>
  );
}

export default StonePaperScissors;