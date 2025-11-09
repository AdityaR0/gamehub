import React from 'react';

function Terms() {
  return (
    <div className="game-page-container">

      <div className="game-content text-content">

        <h1>Terms of Use</h1>
        <p style={{ textAlign: 'center', marginTop: '-1.5rem', marginBottom: '2rem', color: '#888', fontSize: '0.9rem' }}>
          Effective Date: November 9, 2025
        </p>

        <p><i className="fas fa-file-contract"></i> Welcome to GameHub! 
          These Terms of Use ("Terms") govern your access to and use of 
          the GameHub website and its services (the "Service"). By using 
          the Service, you agree to comply with and be bound by these Terms.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using GameHub, you confirm that you can form a 
          binding contract and agree to these Terms. If you do not agree, 
          do not use the Service.
        </p>

        <h2>2. Use of the Service</h2>
        <ul>
          <li>You agree to use GameHub only for lawful purposes and your 
            personal, non-commercial enjoyment.
          </li>
          <li>You must not misuse the Service, including attempting to gain 
            unauthorized access, distributing harmful code, or disrupting the Service.
          </li>
          <li>We grant you a limited, non-exclusive, non-transferable license 
            to access and play the games provided on GameHub for personal use.
          </li>
          {/* --- NEW ITEM --- */}
          <li>**User Account & Data:** You are responsible for maintaining the 
            confidentiality of your account password. **GameHub does not guarantee**             **the permanent storage or retention of game statistics or scores.**
          </li>
        </ul>

        <h2>3. Intellectual Property</h2>
        <p>
          The games available on GameHub are owned by their respective 
          developers or licensors and are protected by copyright laws. 
          The GameHub name, logo, and website design are owned by us. 
          **Developers grant GameHub a limited license to host and display their games on the platform.**
          You agree not to copy, modify, distribute, or create derivative 
          works based on the Service or its content without explicit permission.
        </p>

        <h2>4. Disclaimers and Limitation of Liability</h2>
        <ul>
          <li>The Service is provided "AS IS" and "AS AVAILABLE" without 
            warranties of any kind.
          </li>
          <li>We do not guarantee the Service will be uninterrupted, 
            error-free, or secure.
          </li>
          <li>GameHub, its owners, and affiliates will not be liable for 
            any indirect, incidental, special, consequential, or punitive 
            damages resulting from your use of the Service.
          </li>
        </ul>

        <h2>5. Third-Party Links & Content</h2>
        <p>
          GameHub may contain links to third-party websites or services 
          (including embedded games hosted elsewhere) that are not owned 
          or controlled by us. We are not responsible for the content, 
          privacy policies, or practices of any third-party sites.
        </p>

        <h2>6. Modifications to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will 
          indicate the date of the last revision. Your continued use of 
          the Service after changes constitutes your acceptance of the revised Terms.
        </p>

        <h2>7. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance 
          with the laws of [Your Jurisdiction - e.g., India], without 
          regard to its conflict of law principles.
        </p>

        <p style={{ marginTop: '2rem', fontWeight: 'bold', color: '#cc0000' }}>
          Disclaimer: Please be advised that these Terms of Use are provided as a sample and template only, and their legal sufficiency is not guaranteed for your specific website or jurisdiction. You are strongly advised to consult with a qualified legal professional to ensure these terms are appropriate for your business and location.
        </p>
      
      </div> 
    </div>   
  );
}

export default Terms;