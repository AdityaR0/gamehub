// src/components/MainGameWrapper.jsx

import React, { useState } from 'react';
import { categoryTags } from '../gamesData';
import Home from '../pages/Home'; 
import Navbar from './Navbar'; // Your existing Navbar component

function MainGameWrapper() {
    // --- Central State for Filtering ---
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // Handler for search input changes (passed to Navbar)
    const handleSearchChange = (term) => {
        setSearchTerm(term);
        setActiveCategory('All'); 
    };

    // Handler for category button clicks (passed to Home)
    const handleCategorySelect = (tag) => {
        setActiveCategory(tag);
        setSearchTerm(''); 
    };

    return (
        <>
            {/* RENDER NAVBAR: Passes search state/handler down */}
            <Navbar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
            />
            
            {/* RENDER HOME: Passes filter state/handlers down */}
            <Home
                searchTerm={searchTerm}
                activeCategory={activeCategory}
                handleCategorySelect={handleCategorySelect}
                categoryTags={categoryTags}
            />
        </>
    );
}

export default MainGameWrapper;