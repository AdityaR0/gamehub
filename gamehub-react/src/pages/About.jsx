import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    // 1. This container centers the page
    <div className="game-page-container">
      
      {/* Optional: You can add the header if you want */}
      {/* <div className="game-header">
        <Link to="/" className="back-button">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>
      </div> */}

      {/* 2. THIS IS THE WHITE BOX. 
        It needs BOTH classes: "game-content" and "text-content" 
      */}
      <div className="game-content text-content">

        {/* 3. Your title goes here */}
        <h1>About GameHub</h1>

        {/* 4. Your content goes here. Use h2 and p tags. */}
        <h2>
          {/* Add Font Awesome icons if you like */}
          <i className="fas fa-gamepad"></i> Welcome
        </h2>
        <p>
          Welcome to GameHub, your premier destination for the best free online games! We are passionate
          about bringing joy and entertainment to players of all ages through a curated collection of fun,
          accessible, and high-quality browser games.
        </p>

        <h2>
          <i className="fas fa-bullseye"></i> Our Mission
        </h2>
        <p>
          Our mission is simple: to create a safe, engaging, and completely free gaming environment where
          everyone can relax, challenge themselves, and discover new favorites. We believe fun should have no
          barriers, which is why all our games are instantly playable without downloads or installations.
        </p>

        <h2>
          <i className="fas fa-puzzle-piece"></i> Our Games
        </h2>
        <p>
          Every game on GameHub is carefully selected by our team. We look for games with intuitive gameplay,
          great design, and lasting appeal. From timeless classics like Tic-Tac-Toe and Snake to exciting puzzles
          and reaction games, our library is constantly expanding.
        </p>

        <h2>
          <i className="fas fa-users"></i> Our Community
        </h2>
        <p>
          GameHub is more than just a website; it's a community of players. 
          We invite you to join us by creating a free account to track your stats, save your favorites, and connect with the world of browser gaming.We value your feedback! Let us know what you enjoy and what you'd like to see more of via our Contact page.
        </p>

      </div> {/* End of the white box */}
    </div> // End of the page container
  );
}

export default About;