// components/DesktopGate.jsx
import React, { useState, useEffect } from 'react';

const MOBILE_THRESHOLD = 768; // Screens less than 768px wide are considered mobile

const DesktopGate = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_THRESHOLD);

  const checkScreenSize = () => {
    setIsMobile(window.innerWidth < MOBILE_THRESHOLD);
  };

  useEffect(() => {
    window.addEventListener('resize', checkScreenSize);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  if (isMobile) {
    return (
      <div className="device-warning-container">
        <div className="device-warning-card">
          <span className="warning-icon" role="img" aria-label="Warning">⚠️</span>
          <h2>Device Not Supported</h2>
          <p>
            <strong>This game requires a larger screen display.</strong>
          </p>
          <p>
            For the best gaming experience, please access this page on a <strong>desktop computer, laptop, or tablet</strong>.
          </p>
          <p className="small-text">
            <em>Thank you for your understanding!</em>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DesktopGate;