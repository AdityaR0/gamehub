import React from 'react';

function Privacy() {
  return (
    <div className="game-page-container"> 
      <div className="game-content text-content"> 
        
        <h1>Privacy Policy</h1>
        <p style={{ textAlign: 'center', marginTop: '-1.5rem', marginBottom: '2rem', color: '#888', fontSize: '0.9rem' }}>
          Last Updated: November 9, 2025
        </p>

        <p><i className="fas fa-shield-alt"></i> Your privacy is critically 
          important to us. It is GameHub's policy to respect your privacy 
          regarding any information we may collect while operating our website. 
          This Privacy Policy applies to GameHub (hereinafter, "us", "we", 
          or "GameHub").
        </p>

        <h2>Information We Collect</h2>
        <p>
          We only collect information about you if we have a reason to do 
          so – for example, to provide our Services, to communicate with 
          you, or to make our Services better.
        </p>
        <ul>
          {/* --- NEW & UPDATED ITEMS --- */}
          <li><strong>Account & Registration Data:</strong> When you register 
            for an account, we collect your **Email Address** and **Username**. 
            We store a secured hash of your password.
          </li>
          <li><strong>Game Activity Data:</strong> We collect and store data 
            related to your gameplay, including **High Scores, Wins/Losses, 
            Favorite Games,** and other individual **Game Statistics**.
          </li>
          {/* --- Existing items below are kept --- */}
          <li><strong>Log Data:</strong> Like most website operators, GameHub 
            collects non-personally-identifying information of the sort that 
            web browsers and servers typically make available...
          </li>
          <li><strong>Cookies:</strong> As detailed in our Cookie Policy, we use 
            cookies to help identify and track visitors...
          </li>
          <li><strong>Contact Information:</strong> If you contact us directly 
            (e.g., via email), we may receive additional information...
          </li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect in various ways, including to:</p>
        <ul>
          {/* --- NEW & UPDATED ITEMS --- */}
          <li>Create and manage your user account and profile</li>
          <li>Store, calculate, and display your game statistics and favorites</li>
          <li>Authenticate you when you log in and reset your password</li>
          {/* --- Existing items below are kept --- */}
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Find and prevent fraud</li>
        </ul>

        <h2>Third-Party Services</h2>
        <p>
          We may use third-party services like Google Analytics to monitor 
          and analyze web traffic. We use this data to understand site performance.
        </p>
        <p>
          If we implement advertising (e.g., Google AdSense), third-party 
          vendors will use cookies to serve relevant ads...
        </p>

        <h2>Your Rights</h2>
        <p>
          Depending on your location, you may have rights regarding your 
          personal data, including the right to access, correct, or request deletion of your personal data. Please contact us if you wish to exercise these rights.
        </p>

        <h2>Policy Changes</h2>
        <p>
          Although most changes are likely to be minor, GameHub may change 
          its Privacy Policy from time to time...
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please 
          contact us via the details on our Contact page.
        </p>
      </div> 
    </div>   
  );
}

export default Privacy;