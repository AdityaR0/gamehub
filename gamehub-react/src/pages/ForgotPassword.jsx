import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://gamehub-api-ttpi.onrender.com'; // Define base URL

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // 🛑 FIXED URL HERE
      const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setMessage('');
      setError('Could not connect to the server. Please try again.');
    }
  };

  return (
    <div className="game-page-container">
      <div className="game-content text-content auth-page">

        <h1>Reset Your Password</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '-1rem', marginBottom: '1.5rem' }}>
          Enter your email and we'll send you a reset link.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>

          {message && (
            <div className="auth-message" style={{ color: 'var(--primary-color)', textAlign: 'center', fontWeight: '600' }}>
              {message}
            </div>
          )}
          {error && (
            <div className="auth-message" style={{ color: '#cc0000', textAlign: 'center', fontWeight: '600' }}>
              {error}
            </div>
          )}

          {!message && (
            <>
              <div className="form-group icon-group">
                <i className="fa-solid fa-envelope"></i>
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="game-reset-btn">
                Send Reset Link
              </button>
            </>
          )}
        </form>

        <div className="auth-links">
          <Link to="/login" className="auth-link">
            &larr; Back to Log In
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;
