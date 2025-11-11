import React, { createContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

// --- CORRECT DEPLOYED API BASE URL ---
// This is the public address of your GameHub backend service on Render.
const API_BASE_URL = 'https://gamehub-api-ttpi.onrender.com';

function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = useCallback(async (currentToken) => {
        if (!currentToken) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true); 

        try {
            // Correctly calling the deployed backend API
            const response = await fetch(`${API_BASE_URL}/api/me`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: currentToken }),
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setToken(currentToken);
                setIsAuthenticated(true);
            } else {
                // Auth failed (e.g., 401 from server or expired token)
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('AuthContext: Network or API error during user fetch:', error);
            // On any network failure ("Failed to fetch"), we clear the session
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false); // Ensure loading state is turned off
        } finally {
            setIsLoading(false); 
        }
    }, []); 

    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        if (storedToken && !user) {
            fetchUser(storedToken);
        } else if (!storedToken) {
            setIsLoading(false);
        }
        
    }, [fetchUser, user]); 

    const login = (newToken, userDataFromServer) => {
        localStorage.setItem('token', newToken); 
        setToken(newToken);
        setUser(userDataFromServer); 
        setIsAuthenticated(true);
        setIsLoading(false);
        fetchUser(newToken); 
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
    };
    
    const updateUser = (updatedUserData) => {
        setUser(updatedUserData);
    };

    return (
        <AuthContext.Provider
            value={{ token, isAuthenticated, user, isLoading, login, logout, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };
