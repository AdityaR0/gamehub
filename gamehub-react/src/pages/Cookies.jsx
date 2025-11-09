import React from 'react';

function Cookies() {
  return (
    <div className="game-page-container"> 
      <div className="game-content text-content">
    <>
      <h1>Cookie Policy</h1>
      <p style={{ textAlign: 'center', marginTop: '-1.5rem', marginBottom: '2rem', color: '#888', fontSize: '0.9rem' }}>
        Last Updated: November 9, 2025
      </p>

      <p><i className="fas fa-cookie-bite"></i> This Cookie Policy explains 
        how GameHub ("we", "us", "our") uses cookies and similar 
        technologies when you visit our website.
      </p>

      <h2>What Are Cookies?</h2>
      <p>
        Cookies are small data files placed on your computer or mobile 
        device when you visit a website. They are widely used to make 
        websites work efficiently and provide reporting information. 
        Cookies set by the website owner (us) are called "first-party cookies". 
        Cookies set by parties other than the website owner are called 
        "third-party cookies".
      </p>

      <h2>Why Do We Use Cookies?</h2>
      <p>We use first-party and potentially third-party cookies for several reasons:</p>
      <ul>
        <li><strong>Essential Website Operation:</strong> Some cookies are strictly 
          necessary to provide you with services available through our website 
          and to use some of its features. **This includes cookies required for user login and session management.**
        </li>
        <li><strong>Analytics and Performance:</strong> These cookies collect 
          information used either in aggregate form to help us understand 
          how our website is being used or how effective our marketing 
          campaigns are. We use Google Analytics for this purpose.
        </li>
        <li><strong>Functionality:</strong> These cookies might be used in the 
          future to remember choices you make (like volume preferences) 
          but are not currently implemented.
        </li>
        <li><strong>Advertising:</strong> If we introduce advertising (like Google AdSense), 
          third-party cookies will be used to serve relevant ads. These 
          cookies track your browsing habits across websites.
        </li>
      </ul>

      <h2>Types of Cookies We May Use</h2>
      <ul>
        <li><strong>Session Cookies:</strong> Temporary cookies that expire 
          when you close your browser.
        </li>
        <li><strong>Persistent Cookies:</strong> Remain on your device for a 
          set period or until you delete them.
        </li>
        <li><strong>Google Analytics Cookies:</strong> Used to collect anonymous 
          traffic data (_ga, _gid, _gat).
        </li>
        <li><strong>Third-Party Advertising Cookies:</strong> (If ads are implemented) 
          Used by advertising networks (e.g., Google AdSense) to display targeted ads.
        </li>
      </ul>

      <h2>How Can You Control Cookies?</h2>
      <p>
        You have the right to decide whether to accept or reject cookies. 
        You can exercise your cookie preferences by setting or amending 
        your web browser controls. If you choose to reject cookies, you 
        may still use our website though your access to some functionality 
        and areas may be restricted.
      </p>
      <p>
        Browser manufacturers provide help pages relating to cookie 
        management in their products. Please see below for more information:
      </p>
      <ul>
        {/* Existing links remain unchanged */}
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>Google Chrome</a></li>
        <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>Microsoft Edge</a></li>
        <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>Apple Safari</a></li>
      </ul>
      <p>To find information relating to other browsers, visit the browser developer's website.</p>

      <h2>Updates to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time in order to 
        reflect, for example, changes to the cookies we use or for other 
        operational, legal, or regulatory reasons. Please therefore 
        re-visit this Cookie Policy regularly to stay informed.
      </p>
    </>
    </div>
    </div>
  );
}

export default Cookies;