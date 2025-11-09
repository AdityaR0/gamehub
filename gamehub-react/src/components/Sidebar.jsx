import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Removed useNavigate
import { AuthContext } from '../context/AuthContext';

function Sidebar({ onLoginClick }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Only need isAuthenticated from context here now
  const { isAuthenticated } = useContext(AuthContext); 

  return (
    <aside className="sidebar">
      
      {/* Logo or Back Arrow Link (Unchanged) */}
      <Link 
        to="/" 
        className={isHomePage ? "sidebar-logo" : "sidebar-icon-link"}
      >
        {isHomePage ? (
          <img src="/images/game.png" alt="GameHub Logo" />
        ) : (
          <i className="fa-solid fa-arrow-left"></i>
        )}
      </Link>

      {/* Navigation Icons Area */}
      <nav className="sidebar-nav">
        {/* Check if the user is logged in */}
        {isAuthenticated ? (
          // --- USER IS LOGGED IN ---
          // Show ONLY the "My Account" icon/link
          <Link to="/profile" className="nav-icon-btn" title="My Account">
            <i className="fa-solid fa-user-gear"></i> 
          </Link>
          
        ) : (
          // --- USER IS LOGGED OUT ---
          // Show the Login icon/button
          <button className="nav-icon-btn" title="Login" onClick={onLoginClick}>
            <i className="fa-regular fa-user"></i> 
          </button>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;