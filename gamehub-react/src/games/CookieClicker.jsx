// src/games/CookieClicker.jsx

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/CookieClicker.css';

const GAME_ID = 'cookie-clicker';

const UPGRADES = [
    { id: 1, name: 'Cursor', cost: 10, cps: 0.1 },
    { id: 2, name: 'Grandma', cost: 100, cps: 1 },
    { id: 3, name: 'Farm', cost: 1000, cps: 10 },
];

function CookieClicker() {
    const [cookies, setCookies] = useState(0);
    const [cps, setCps] = useState(0); // Cookies per second
    const [upgradeLevels, setUpgradeLevels] = useState(UPGRADES.map(u => ({ ...u, level: 0 })));
    const [status, setStatus] = useState("Keep clicking!");
    
    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 

    const recordGameResult = useCallback(async (finalScore) => {
        // ... (record logic) ...
    }, [isAuthenticated, token, updateUser]);

    // Effect for CPS calculation and timer
    useEffect(() => {
        // Calculate total CPS
        const totalCPS = upgradeLevels.reduce((sum, u) => sum + u.cps * u.level, 0);
        setCps(totalCPS);

        // Timer to add passive cookies
        const interval = setInterval(() => {
            setCookies(c => c + totalCPS);
        }, 1000); 

        return () => clearInterval(interval);
    }, [upgradeLevels]);


    const handleClick = () => {
        setCookies(c => c + 1); // +1 per click
    };

    const handleBuyUpgrade = (upgradeId) => {
        setUpgradeLevels(prevLevels => {
            const index = prevLevels.findIndex(u => u.id === upgradeId);
            const upgrade = prevLevels[index];

            if (cookies >= upgrade.cost) {
                const newLevels = [...prevLevels];
                const nextLevel = upgrade.level + 1;
                
                newLevels[index] = { 
                    ...upgrade, 
                    level: nextLevel,
                    cost: Math.round(upgrade.cost * 1.15) // Price increases by 15%
                };
                
                setCookies(c => c - upgrade.cost);
                setStatus(`Bought ${upgrade.name}!`);
                return newLevels;
            } else {
                setStatus(`Not enough cookies! Need ${upgrade.cost - cookies} more.`);
                return prevLevels;
            }
        });
    };
    
    const handleReset = () => {
        setCookies(0);
        setCps(0);
        setUpgradeLevels(UPGRADES.map(u => ({ ...u, level: 0 })));
        setStatus("Game Reset. Start clicking!");
        // Note: You may want to record the final cookie count here
        recordGameResult(cookies); 
    };

    return (
        <div className="game-content">
            <h1>Cookie Clicker</h1>
            <div className="cc-container" id="cookie-clicker-game">

                <div className="cc-stats">
                    <span className="cc-stat-label">Total Cookies: {Math.floor(cookies)}</span>
                    <span className="cc-stat-label">CPS: {cps.toFixed(1)}</span>
                </div>

                <div id="cc-click-area">
                    <button className="cc-cookie-btn" onClick={handleClick}>
                        🍪
                    </button>
                </div>
                
                <h2 id="game-status" className="cc-game-status">{status}</h2>

                <div className="cc-upgrades">
                    <h3>Upgrades</h3>
                    {upgradeLevels.map(upgrade => (
                        <div key={upgrade.id} className="cc-upgrade-item">
                            <span className="cc-upgrade-name">{upgrade.name} (Lvl {upgrade.level})</span>
                            <span className="cc-upgrade-cps">+{upgrade.cps} CPS</span>
                            <button 
                                className="cc-buy-btn"
                                onClick={() => handleBuyUpgrade(upgrade.id)}
                                disabled={cookies < upgrade.cost}
                            >
                                Buy ({Math.floor(upgrade.cost)})
                            </button>
                        </div>
                    ))}
                </div>

                <button 
                    id="reset-button"
                    className="cc-reset-btn" 
                    onClick={handleReset}>
                    Reset Game
                </button>
            </div>
        </div>
    );
}

export default CookieClicker;