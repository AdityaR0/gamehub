import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { gamesData } from '../gamesData'; // Make sure path is correct

// Helper function
const getGameDetails = (gameId) => {
    return gamesData.find(game => game.id === gameId);
};

function Profile() {
    const { user, isLoading, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('stats'); // Default to Stats

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // --- Loading/Error Handling ---
    if (isLoading) {
        return (
            <div className="profile-page-layout">
                <nav className="profile-nav-menu"> </nav>
                <div className="profile-content-area"><p className="loading-text">Loading...</p></div>
            </div>
        );
    }
    if (!user) {
        return (
            <div className="profile-page-layout">
                <nav className="profile-nav-menu"></nav>
                <div className="profile-content-area">
                    <p className="error-text"> Could not load user data. Please <Link to="/login" className="auth-link">log in</Link>.</p>
                </div>
            </div>
        )
    }
    // --- End Loading ---

    // ====================================================================
    // FIX: Change user.favorites to user.favoriteGames
    // ====================================================================
    const gameStats = user.gameStats || { totalPlayed: 0, wins: 0, losses: 0, draws: 0 };
    const favoriteGames = user.favoriteGames || []; // <<< THIS LINE IS FIXED
    // ====================================================================


    // --- Function to render the content based on activeSection ---
    const renderContent = () => {
        const currentStats = gameStats; // Use the stats variable
        
        switch (activeSection) {
            case 'stats':
                return (
                    <div className="profile-section">
                        <h2>Game Statistics</h2>
                        <div className="profile-stats-grid">
                            <div className="stat-card"><h4>TOTAL PLAYED</h4><p>{currentStats.totalPlayed}</p></div>
                            <div className="stat-card"><h4>WINS</h4><p className="stat-wins">{currentStats.wins}</p></div>
                            <div className="stat-card"><h4>LOSSES</h4><p className="stat-losses">{currentStats.losses}</p></div>
                            <div className="stat-card"><h4>DRAWS</h4><p>{currentStats.draws}</p></div>
                        </div>
                    </div>
                );
            case 'favorites':
                return (
                    <div className="profile-section">
                        <h2>Favorite Games</h2>
                        {favoriteGames.length > 0 ? (
                            <div className="profile-favorites-scroller">
                                <div className="profile-favorites-container">
                                    {/* CRITICAL: Mapping over the array of game IDs */}
                                    {favoriteGames.map((gameId) => {
                                        const gameDetails = getGameDetails(gameId);
                                        if (!gameDetails) return null;
                                        return (
                                            <Link to={gameDetails.path} className="game-card favorite-game-card" key={gameId} data-title={gameDetails.title}>
                                                <div className="card-image-wrapper">
                                                    <img src={gameDetails.img} alt={gameDetails.title} />
                                                </div>
                                                <span className="favorite-game-title">{gameDetails.title}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <p className="profile-no-favorites">You haven't added any favorite games yet! Click the heart on any game on the homepage to save it.</p>
                        )}
                    </div>
                );
            case 'account':
            default:
                return (
                    <div className="profile-section">
                        <h2>Account Details</h2>
                        <div className="profile-account-details">
                            <div className="profile-avatar-placeholder">
                                <i className="fa-solid fa-user"></i>
                            </div>
                            <div className="profile-user-info">
                                <span className="profile-user-name">{user.name || 'N/A'}</span>
                                <span className="profile-user-email">{user.email || 'N/A'}</span>
                            </div>
                    </div>
                    </div>
                );
        }
    };

    return (
        <div className="profile-page-layout">
            <nav className="profile-nav-menu">
                <ul>
                    <li className={activeSection === 'account' ? 'active' : ''}>
                        <button onClick={() => setActiveSection('account')}><i className="fa-solid fa-user-circle"></i> My Account</button>
                    </li>
                    <li className={activeSection === 'stats' ? 'active' : ''}>
                        <button onClick={() => setActiveSection('stats')}><i className="fa-solid fa-chart-simple"></i> Game Stats</button>
                    </li>
                    <li className={activeSection === 'favorites' ? 'active' : ''}>
                        <button onClick={() => setActiveSection('favorites')}><i className="fa-solid fa-heart"></i> Favorites</button>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="logout-link"><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
                    </li>
                </ul>
            </nav>
            <div className="profile-content-area">
                {renderContent()}
            </div>
        </div>
    );
}

export default Profile;