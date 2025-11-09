import React, { createContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
    // 1. Initial state setup is correct
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = useCallback(async (currentToken) => {
        // console.log("--- Executing fetchUser ---");
        if (!currentToken) {
            setIsLoading(false);
            return;
        }

        // Set loading state true only when performing the API call
        setIsLoading(true); 

        try {
            const response = await fetch('https://gamehub-api-ttpi.onrender.com', {
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
    }, []); // 2. CRITICAL FIX: Empty dependency array ensures fetchUser is only created once.

    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        // If we have a token in storage AND the user hasn't been set yet, fetch user data.
        // This runs once on mount and handles the persistent session.
        if (storedToken && !user) {
            fetchUser(storedToken);
        } else if (!storedToken) {
            // If no token, we are logged out. Stop loading.
            setIsLoading(false);
        }
        
    }, [fetchUser, user]); // 3. Depend only on fetchUser and user state changes

    const login = (newToken, userDataFromServer) => {
        localStorage.setItem('token', newToken); // Saves token for persistence
        setToken(newToken);
        setUser(userDataFromServer); 
        setIsAuthenticated(true);
        setIsLoading(false);
        // CRITICAL FIX: The useEffect handles the full fetch, but we can initiate it here too for speed
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

    // Provide state and functions to children
    return (
        <AuthContext.Provider
            value={{ token, isAuthenticated, user, isLoading, login, logout, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };
