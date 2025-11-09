import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const { token } = useParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
        setError('Missing reset token. Please use the full link from your email.');
        return;
    }

    try {
      // 🛑 FIX IS HERE: Append the token to the URL path
      const response = await fetch(`http://localhost:3001/api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Only send the new password in the body
        body: JSON.stringify({ password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message + ' Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Could not connect to the server.');
    }
  };

  return (
    // 1. ADDED: Outer Page Wrapper
    <div className="game-page-container">
      {/* 2. ADDED: Inner White Box Wrapper */}
      <div className="game-content text-content auth-page">

        <h1>Set a New Password</h1>
        
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

          <div className="form-group icon-group">
            <i className="fa-solid fa-lock"></i>
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password (6+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <i 
              className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle-icon`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          <div className="form-group icon-group">
            <i className="fa-solid fa-lock"></i>
            <input 
              type="password" 
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="game-reset-btn">
            Reset Password
          </button>
        </form>

      </div> 
    </div>   
  );
}

export default ResetPassword;