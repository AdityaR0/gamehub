// src/games/Solitaire.jsx

import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react'; // FIX: ADDED useEffect
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/Solitaire.css';

const GAME_ID = 'solitaire';

// Simplified Card Structure (Value, Suit, FaceUp status)
const createDeck = () => {
    // This function should create and shuffle a full 52-card deck
    return [
        { id: 1, value: 'A', suit: 'H', faceUp: true },
        { id: 2, value: 'K', suit: 'C', faceUp: true },
        // ... (rest of the cards)
    ];
};

const initialPiles = {
    stock: [{ id: 3, value: '9', suit: 'D', faceUp: false }], 
    waste: [],
    foundations: { H: [], D: [], C: [], S: [] },
    tableaus: [
        [{ id: 4, value: '7', suit: 'S', faceUp: true }], 
        [{ id: 5, value: '6', suit: 'C', faceUp: false }, { id: 6, value: '5', suit: 'D', faceUp: true }],
        [/* 5 more empty tableaus */],
        [/* 5 more empty tableaus */],
        [/* 5 more empty tableaus */],
        [/* 5 more empty tableaus */],
        [/* 5 more empty tableaus */],
    ]
};

function Solitaire() {
    const [piles, setPiles] = useState(initialPiles);
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(0);
    const [status, setStatus] = useState("Draw cards or move a card!");
    const [gameActive, setGameActive] = useState(true);

    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 
    
    // Timer logic (simplified)
    useEffect(() => { // This line caused the error!
        let interval = null;
        if (gameActive) {
            interval = setInterval(() => setTime(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [gameActive]);

    const recordGameResult = useCallback(async (gameResult) => {
        if (!isAuthenticated || !token) return; 

        try {
            const response = await fetch('http://localhost:3001/api/stats/record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ gameId: GAME_ID, result: gameResult, value: score }),
            });
            if (response.ok) {
                const successData = await response.json();
                if (successData.user && updateUser) updateUser(successData.user); 
            }
        } catch (error) {
            console.error('Solitaire: Network error recording result:', error);
        }
    }, [isAuthenticated, token, updateUser, score]);


    const handleReset = () => {
        setPiles(initialPiles); 
        setScore(0);
        setTime(0);
        setGameActive(true);
        setStatus("New game dealt.");
    };
    
    const renderCard = (card, isTop) => {
        const value = card.value;
        const suit = card.suit === 'H' || card.suit === 'D' ? 'red' : 'black';
        const colorClass = card.faceUp ? suit : 'back';
        
        return (
            <div 
                key={card.id} 
                className={`sol-card ${colorClass} ${isTop ? 'top-card' : 'stacked-card'}`}
            >
                {card.faceUp ? `${value}${card.suit}` : ''}
            </div>
        );
    };
    
    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="game-content">
            <h1>Solitaire (Klondike)</h1>
            <div className="sol-container" id="solitaire-game">

                <div className="sol-stats">
                    <span className="sol-stat-label">Score: {score}</span>
                    <span className="sol-stat-label">Time: {formatTime(time)}</span>
                </div>
                
                {/* Top Area: Stock, Waste, Foundations */}
                <div className="sol-top-area">
                    {/* Stock & Waste */}
                    <div className="sol-pile stock-pile">
                        {piles.stock.length > 0 ? renderCard(piles.stock[0], true) : <div className="sol-empty-slot">Deck</div>}
                    </div>
                    <div className="sol-pile waste-pile">
                        {piles.waste.length > 0 ? renderCard(piles.waste[piles.waste.length - 1], true) : <div className="sol-empty-slot">Waste</div>}
                    </div>
                    <div className="sol-spacer"></div>

                    {/* Foundations */}
                    {Object.keys(piles.foundations).map(suit => (
                        <div key={suit} className="sol-pile foundation-pile">
                            {piles.foundations[suit].length > 0 
                                ? renderCard(piles.foundations[suit].slice(-1)[0], true)
                                : <div className="sol-empty-slot">{suit}</div>}
                        </div>
                    ))}
                </div>

                {/* Main Area: Tableaus (7 piles) */}
                <div id="sol-tableau-area">
                    {piles.tableaus.map((pile, index) => (
                        <div key={index} className="sol-pile tableau-pile">
                            {pile.length > 0 ? (
                                pile.map((card, cardIndex) => (
                                    <div 
                                        key={card.id} 
                                        style={{ position: 'absolute', top: `${cardIndex * 20}px` }}
                                        className="sol-card-stack-item"
                                    >
                                        {renderCard(card, cardIndex === pile.length - 1)}
                                    </div>
                                ))
                            ) : (
                                <div className="sol-empty-slot">Tab {index + 1}</div>
                            )}
                        </div>
                    ))}
                </div>

                <h2 id="game-status" className="sol-game-status">{status}</h2>

                <button 
                    id="reset-button"
                    className="sol-reset-btn" 
                    onClick={handleReset}>
                    New Deal
                </button>
            </div>
        </div>
    );
}

export default Solitaire;