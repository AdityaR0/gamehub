import React from 'react';

function Developers() {
  return (
    // 1. ADDED THIS WRAPPER: Centers the whole page
    <div className="game-page-container"> 

      {/* 2. ADDED THIS WRAPPER: This IS the white box */}
      <div className="game-content text-content">
    <>
      <h1>GameHub for Developers</h1>

      <h2><i className="fas fa-rocket"></i> Showcase Your HTML5 Game!</h2>
      <p>
        Are you an indie developer or studio creating fantastic HTML5 games? 
        GameHub provides a platform to connect your creations with a 
        growing audience eager for fun browser-based entertainment. 
        We're passionate about supporting developers and bringing 
        diverse games to our players.
      </p>

      <h2><i className="fas fa-lightbulb"></i> Why Partner with GameHub?</h2>
      <ul>
        <li><strong>Instant Audience:</strong> Feature your game on a platform 
          dedicated to casual online gaming.
        </li>
        <li><strong>Developer Focused:</strong> We appreciate the craft and aim 
          for simple, respectful partnerships.
        </li>
        <li><strong>Easy Integration:</strong> We primarily work with self-hosted 
          or easily embeddable HTML5 games (using `iframe`).
        </li>
        <li><strong>Cross-Promotion:</strong> Gain visibility within our community.</li>
      </ul>

      <h2><i className="fas fa-paper-plane"></i> Submission Guidelines</h2>
      <p>
        We're looking for high-quality, family-friendly HTML5 games that 
        run smoothly in modern web browsers on both desktop and mobile.
      </p>
      <p>To submit your game for review, please email us the following information:</p>
      <ul>
        <li>Your Name / Studio Name</li>
        <li>Game Title</li>
        <li>A playable link (URL) to your game</li>
        <li>Brief description (Genre, Key Features)</li>
        <li>Monetization details (if any within the game)</li>
        <li>Your contact email</li>
      </ul>
      <p>
        Send your submissions to: 
        <a href="mailto:gamehubsubmissions@gmail.com" style={{ color: 'var(--primary-color)', fontWeight: 500 }}>
          gamehubsubmissions@gmail.com
        </a>
      </p>
      <p>
        We review all submissions but due to volume, may only respond if 
        interested. Thank you for considering GameHub!
      </p>
    </>
    </div>
    </div>
  );
}

export default Developers;