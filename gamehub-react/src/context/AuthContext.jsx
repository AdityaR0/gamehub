import React, { createContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

// Define the API Base URL once for easy updates and cleaner code
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
            // --- CRITICAL FIX APPLIED HERE: Added the correct endpoint (/api/me) ---
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
                // Auth failed (401 from server)
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('AuthContext: Network or API error during user fetch:', error);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
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
