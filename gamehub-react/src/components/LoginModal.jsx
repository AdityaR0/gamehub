import React from 'react';
import { Link } from 'react-router-dom';

function LoginModal({ isOpen, onClose }) {

  // If not open, render nothing. This is correct.
  if (!isOpen) {
    return null;
  }

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // --- THIS IS THE FIX ---
  // We now dynamically add the 'active' class
  // to the overlay when 'isOpen' is true.
  const overlayClassName = `modal-overlay ${isOpen ? 'active' : ''}`;

  return (
    <div 
      className={overlayClassName} // <-- Use the new class variable
      id="login-modal" 
      onClick={onClose}
    >
      <div className="modal-content" onClick={handleModalContentClick}>
        <button className="modal-close-btn" id="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="modal-body">
          <h2 style={{ marginBottom: '2rem' }}>Join GameHub</h2>
          
          <Link 
            to="/register" 
            className="social-login-btn game-reset-btn" 
            onClick={onClose}
            style={{ textDecoration: 'none', color: '#fff' }}
          >
            Create an Account
          </Link>
          
          <Link 
            to="/login" 
            className="social-login-btn" 
            onClick={onClose}
            style={{ textDecoration: 'none', color: 'var(--poki-text)' }}
          >
            Log In
          </Link>
          
          <div style={{ 
            textAlign: 'center', 
            margin: '1.5rem 0', 
            color: '#aaa', 
            fontWeight: '600'
          }}>
            OR
          </div>
          
          {/* <button className="social-login-btn">
            <i className="fa-brands fa-google"></i> Continue with Google
          </button> */}
          {/* Use the Google button style */}
          <button 
            className="social-login-btn google-btn"
            // --- THIS IS THE CHANGE ---
            onClick={() => {
              // Redirect the user to your server's Google Auth route
              window.location.href = 'http://localhost:3001/auth/google'; 
            }}
            // --- END OF CHANGE ---
          >
            <i className="fa-brands fa-google"></i> Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;