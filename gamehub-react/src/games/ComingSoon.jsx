// src/games/ComingSoon.jsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../assets/css/ComingSoon.css';

// Helper to format the game name from the URL path
const formatGameName = (path) => {
    // Example: converts 'tower-of-hanoi' to 'Tower of Hanoi'
    const parts = path.split('-');
    if (parts.length === 0) return "New Game";
    
    // Capitalize each word
    return parts.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

function ComingSoon() {
    // Get the game ID from the URL (e.g., 'tower-of-hanoi')
    const { gameId } = useParams();
    const gameTitle = formatGameName(gameId);

    return (
        <div className="game-content">
            <h1>Game Development Hub</h1>
            <div className="cs-container" id="coming-soon-page">
                
                <div className="cs-header">
                    <span className="cs-icon">🚧</span>
                    <h2>{gameTitle}</h2>
                </div>

                <p className="cs-message-main">
                    This game is currently **under construction**!
                </p>
                
                <div className="cs-details">
                    <p>We're working hard to finalize the rules, integrate the professional game logic, and ensure it meets our high standards for a great player experience.</p>
                    <p>It will be ready for launch very soon. Thanks for your patience!</p>
                </div>
                
                <div className="cs-action">
                    <Link to="/" className="cs-home-btn">
                        Explore Active Games
                    </Link>
                </div>

                <div className="cs-footer-note">
                    Check back frequently! We're updating our game catalog every week.
                </div>
            </div>
        </div>
    );
}

export default ComingSoon;