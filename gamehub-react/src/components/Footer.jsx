import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer-main">
      <div className="footer-content">
        <div className="footer-left">
          <Link to="/" className="footer-logo">GameHub</Link>
          <p className="footer-tagline">Let the world play</p>
          <div className="footer-socials">
            {/* External links (or placeholders) can stay as <a> tags */}
            <a href="#" className="social-icon"><i className="fa-brands fa-tiktok"></i></a>
            <a href="#" className="social-icon"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="social-icon"><i className="fa-brands fa-youtube"></i></a>
          </div>
        </div>

        <div className="footer-right">
          <div className="footer-column">
            <h3>Get to Know Us</h3>
            <ul>
              {/* Use <Link> and 'to' for all your internal pages */}
              <li><Link to="/about">About GameHub</Link></li>
              <li><Link to="/developers">For Developers</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Privacy & Terms</h3>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Use</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Help & Support</h3>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom-bar">
        <p>&copy; 2025 GameHub. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;