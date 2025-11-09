import React, { useState } from 'react';

function Navbar() {
  // State to hold the value of the search input
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input
          type="text"
          placeholder="What are you playing today?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Navbar;