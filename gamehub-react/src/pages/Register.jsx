import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true); 

    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Registration fetch error:', error); 
      setMessage('Error: Could not connect to the server or registration failed.');
    } finally {
        setIsLoading(false); 
    }
  };

  return (
    // 1. ADDED: Outer Page Wrapper
    <div className="game-page-container">
      {/* 2. ADDED: Inner White Box Wrapper */}
      <div className="game-content text-content auth-page">

        <h1>Create an Account</h1>

        <form className="auth-form" onSubmit={handleSubmit}>

          {message && (
            <div
              className="auth-message"
              style={{
                color: message.startsWith('Error') ? '#cc0000' : 'var(--primary-color)',
                textAlign: 'center',
                fontWeight: '600',
                marginBottom: '1rem'
              }}
            >
              {message}
            </div>
          )}

          <div className="form-group icon-group">
            <i className="fa-solid fa-user"></i>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading} 
            />
          </div>

          <div className="form-group icon-group">
            <i className="fa-solid fa-envelope"></i>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading} 
            />
          </div>

          <div className="form-group icon-group">
            <i className="fa-solid fa-lock"></i>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading} 
            />
            <i
              className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle-icon`}
              onClick={() => !isLoading && setShowPassword(!showPassword)}
            ></i>
          </div>

          <button type="submit" className="game-reset-btn" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-links">
          Already have an account?
          <Link to="/login" className="auth-link">
            Log In
          </Link>
        </div>

      </div> 
    </div>   
  );
}

export default Register;