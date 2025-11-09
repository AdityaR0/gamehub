import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function GameCard({ game }) {
    const { user, isAuthenticated, updateUser, token } = useContext(AuthContext);
    
    // CRITICAL FIX: Check the correct user property: 'favoriteGames'
    const isFavorited = isAuthenticated && user?.favoriteGames?.includes(game.id);

    const handleToggleFavorite = async (e) => {
        // Prevent clicking the favorite icon from navigating to the game page
        e.preventDefault(); 
        e.stopPropagation();

        if (!isAuthenticated || !token) {
            alert("Please log in to save favorites!");
            return;
        }

        const action = isFavorited ? 'remove' : 'add';
        
        try {
            // The API endpoint path is correct here: /api/favorites/add or /api/favorites/remove
            const response = await fetch(`http://localhost:3001/api/favorites/${action}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ gameId: game.id }),
            });

            if (response.ok) {
                const successData = await response.json();
                // Update the global user state with the new user object (containing updated favoriteGames)
                if (successData.user && updateUser) {
                    updateUser(successData.user); 
                }
            } else {
                alert(`Failed to ${action} favorite.`);
            }
        } catch (error) {
            console.error(`Network error toggling favorite:`, error);
        }
    };

    return (
        // Link to the game page
        <Link to={game.path} className="game-card">
            <div className="card-image-wrapper">
                {/* Image source comes from the gamesData object */}
                <img src={game.img} alt={game.title} />
            </div>
            
            {/* Favorite Icon */}
            <button 
                className="favorite-btn" 
                onClick={handleToggleFavorite}
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
                {/* Use Font Awesome heart icons: fas for solid/favorited, far for regular/empty */}
                <i className={`fa-heart ${isFavorited ? 'fas' : 'far'}`}></i>
            </button>
        </Link>
    );
}

export default GameCard;