import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 

// --- CRITICAL CONFIGURATION ---
const API_BASE_URL = 'https://gamehub-api-ttpi.onrender.com';
const GOOGLE_CLIENT_ID = '324434221621-dk68jl8lbfbbmf52tia69es7mjveh578.apps.googleusercontent.com';
// ----------------------------

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // --- GOOGLE LOGIN HANDLER ---
  const handleGoogleCallback = async (response) => {
    setMessage('');
    setIsLoading(true);

    try {
      // 1. Send the Google ID token to your backend for verification and login/registration
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        setMessage('Google login successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setMessage(`Error: ${data.message || 'Google sign-in failed.'}`);
      }
    } catch (error) {
      console.error('Google login fetch error:', error);
      setMessage('Error: Could not connect to the server for Google sign-in.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 2. Initialize Google sign-in only if the library is loaded (make sure to include the script in index.html)
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });

      // 3. Render the Google button into the designated div
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large", type: "standard", width: "100%" }
      );
      // Optional: hide the prompt
      window.google.accounts.id.prompt(); 
    }
  }, [login, navigate]); // Depend on login and navigate to avoid stale closures
  // ----------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      // 🛑 FIXED URL for standard registration
      const response = await fetch(`${API_BASE_URL}/api/register`, {
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
      // Check for ERR_CONNECTION_REFUSED type errors
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          setMessage('Error: Server connection refused. Please ensure the API is running.');
      } else {
          setMessage('Error: Could not connect to the server or registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="game-page-container">
      <div className="game-content text-content auth-page">

        <h1>Create an Account</h1>

        {/* GOOGLE SIGN-IN BUTTON CONTAINER */}
        <div id="googleSignInDiv" style={{marginBottom: '1rem'}}></div>
        {/* Separator */}
        <div style={{textAlign: 'center', margin: '1rem 0', color: '#aaa'}}>OR</div>
        
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
