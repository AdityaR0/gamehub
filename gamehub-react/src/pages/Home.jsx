// src/pages/Home.jsx

import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gamesData, categoryTags } from '../gamesData';
import { AuthContext } from '../context/AuthContext'; 
import GameCard from '../components/GameCard';

function Home() {
    const { login } = useContext(AuthContext); 
    const [searchParams, setSearchParams] = useSearchParams(); 

    // --- STATE MANAGEMENT ---
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All'); 
    // --- END STATE ---

    // --- Google Login Handling (Remains the same) ---
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            login(token, null);
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, login, setSearchParams]);


    // --- FILTERING LOGIC ---
    const filteredGames = useMemo(() => {
        let filtered = gamesData;

        // 1. Filter by Category (Category logic is working, keep this!)
        if (activeCategory !== 'All') {
            filtered = filtered.filter(game => game.tags.includes(activeCategory));
        }

        // 2. Filter by Search Term
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(game => 
                game.title.toLowerCase().includes(lowerCaseSearch)
            );
        }

        return filtered;
    }, [activeCategory, searchTerm]); 

    // --- HANDLERS ---
    
    const handleCategoryClick = useCallback((tag) => {
        setActiveCategory(tag);
        setSearchTerm(''); // Clear search when filtering by category
    }, []);

    // **CRITICAL FIX: Connect the external search bar using standard DOM query and event listener**
    useEffect(() => {
        // We target the input element (assuming it's the only one with this placeholder or specific class)
        // Find the input element that has "What are you playing today?"
        const searchInput = document.querySelector('input[placeholder="What are you playing today?"]');
        
        if (searchInput) {
            // Function to synchronize the state with the external input value
            const updateSearchState = (e) => {
                const newValue = e.target.value;
                setSearchTerm(newValue);
                // When actively typing in the search bar, switch category display to 'All'
                if (newValue) {
                    setActiveCategory('All');
                }
            };

            // Attach the change listener
            searchInput.addEventListener('input', updateSearchState);

            // Cleanup function to remove the listener when the component unmounts
            return () => {
                searchInput.removeEventListener('input', updateSearchState);
            };
        }
    }, []); 
    
    // --- JSX START ---
    return (
        <>
            {/* REMOVED: Redundant search bar JSX. We rely on the search bar rendered elsewhere. */}
            
            {/* 1. CATEGORY TAGS IMPLEMENTATION (This section is working) */}
            <div className="category-tags">
                {categoryTags.map((tag) => (
                    <button
                        className={`tag ${tag === activeCategory ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(tag)}
                        key={tag}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            <h1>{activeCategory === 'All' && searchTerm === '' ? 'All Games' : activeCategory + ' Games'}</h1>
            
            {/* 2. GAME GRID USES FILTERED DATA */}
            <div className="game-grid">
                {filteredGames.length > 0 ? (
                    filteredGames.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))
                ) : (
                    <p className="no-results">No games found matching your criteria.</p>
                )}
            </div>
        </>
    );
}

export default Home;