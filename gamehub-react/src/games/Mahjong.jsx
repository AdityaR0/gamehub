// src/games/Mahjong.jsx

import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/Mahjong.css';

const GAME_ID = 'mahjong';

// Example tiles (needs many pairs for a real game, simplified here)
const TILE_PAIRS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const createBoard = () => {
    // Generates a simple 4x5 grid for demonstration (20 tiles total, 10 pairs)
    let tiles = [...TILE_PAIRS, ...TILE_PAIRS]
        .map((icon, index) => ({
            id: index,
            icon,
            isMatched: false,
            isSelected: false,
        }))
        .sort(() => Math.random() - 0.5); // Shuffle
    return tiles;
};

function Mahjong() {
    const [tiles, setTiles] = useState(createBoard);
    const [selectedTiles, setSelectedTiles] = useState([]);
    const [matches, setMatches] = useState(0);
    const [moves, setMoves] = useState(0);
    const [gameActive, setGameActive] = useState(true);
    const [status, setStatus] = useState("Find the matching pairs!");

    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 

    const isWon = useMemo(() => matches === TILE_PAIRS.length, [matches]);

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
            console.error('Mahjong: Network error recording result:', error);
        }
    }, [isAuthenticated, token, updateUser, moves]);

    useEffect(() => {
        if (isWon && gameActive) {
            setStatus(`🎉 You won in ${moves} moves!`);
            setGameActive(false);
            recordGameResult('win');
        }
    }, [isWon, gameActive, moves, recordGameResult]);

    // Match checking logic
    useEffect(() => {
        if (selectedTiles.length === 2) {
            setMoves(m => m + 1);
            const [tile1, tile2] = selectedTiles;
            
            if (tile1.icon === tile2.icon) {
                // Match!
                setTimeout(() => {
                    setTiles(prev => prev.map(t => 
                        t.id === tile1.id || t.id === tile2.id ? { ...t, isMatched: true, isSelected: false } : t
                    ));
                    setMatches(m => m + 1);
                    setSelectedTiles([]);
                    setStatus("Match found!");
                }, 500);
            } else {
                // No match, flip back
                setTimeout(() => {
                    setTiles(prev => prev.map(t => 
                        t.id === tile1.id || t.id === tile2.id ? { ...t, isSelected: false } : t
                    ));
                    setSelectedTiles([]);
                    setStatus("No match. Try again.");
                }, 800);
            }
        }
    }, [selectedTiles]);

    const handleTileClick = useCallback((clickedTile) => {
        if (!gameActive || clickedTile.isMatched || clickedTile.isSelected || selectedTiles.length === 2) return;

        // Select tile
        setTiles(prev => prev.map(t => 
            t.id === clickedTile.id ? { ...t, isSelected: true } : t
        ));
        setSelectedTiles(prev => [...prev, clickedTile]);

    }, [gameActive, selectedTiles]);


    const resetGame = useCallback(() => {
        setTiles(createBoard());
        setSelectedTiles([]);
        setMatches(0);
        setMoves(0);
        setGameActive(true);
        setStatus("Find the matching pairs!");
    }, []);

    return (
        <div className="game-content">
            <h1>Mahjong Match</h1>
            <div className="mj-container" id="mahjong-game">

                <div className="mj-stats">
                    <span className="mj-stat-label">Pairs Matched: {matches}/{TILE_PAIRS.length}</span>
                    <span className="mj-stat-label">Moves: {moves}</span>
                </div>

                <div id="mj-board">
                    {tiles.map(tile => (
                        <div
                            key={tile.id}
                            className={`mj-tile ${tile.isMatched ? 'matched' : ''} ${tile.isSelected ? 'selected' : ''}`}
                            onClick={() => handleTileClick(tile)}
                        >
                            <div className="mj-tile-content">
                                {tile.isMatched || tile.isSelected ? tile.icon : '?'}
                            </div>
                        </div>
                    ))}
                </div>

                <h2 id="game-status" className="mj-game-status">{status}</h2>

                <button 
                    id="reset-button"
                    className="mj-reset-btn" 
                    onClick={resetGame}>
                    {isWon ? 'Play New Game' : 'Reset Game'}
                </button>
            </div>
        </div>
    );
}

export default Mahjong;