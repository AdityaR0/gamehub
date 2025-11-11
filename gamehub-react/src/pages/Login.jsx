import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    console.log('Attempting login for:', email);

    try {
      // const response = await fetch('http://localhost:3001/api/login', {
      // NEW CORRECT LINE
        const response = await fetch('https://gamehub-api-ttpi.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (response.ok) {
        login(data.token, data.user);
        setMessage('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setMessage(`Error: ${data.message || 'Login failed'}`);
      }
    } catch (error) {
      console.error('Login fetch error:', error);
      setMessage('Error: Could not connect to the server or login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX for the Login Form ---
  return (
    // 1. Outer wrapper for centering/page styling
    <div className="game-page-container">

      {/* 2. Inner wrapper for the white box. Removed inline style for CSS control. */}
      <div className="game-content text-content auth-page"> 

        <h1>Welcome Back!</h1>

        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Display success or error messages */}
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

          {/* Email Input */}
          <div className="form-group icon-group">
            {/* The icon must be the first child in the flex container */}
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

          {/* Password Input */}
          <div className="form-group icon-group">
            <i className="fa-solid fa-lock"></i>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            {/* Show/Hide Password Icon is NOT the first child, so it's fine */}
            <i
              className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle-icon`}
              onClick={() => !isLoading && setShowPassword(!showPassword)}
            ></i>
          </div>

          {/* Forgot Password Link */}
          <div className="auth-links-extra">
            <Link to="/forgot-password" className="auth-link-muted">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button type="submit" className="game-reset-btn" disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {/* Link to Register Page */}
        <div className="auth-links">
          Don't have an account?
          <Link to="/register" className="auth-link">
            Register
          </Link>
        </div>

      </div>
    </div>   
  );
}

export default Login;
