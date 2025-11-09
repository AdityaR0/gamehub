import React from 'react';

function Contact() {
  return (
    // 1. ADDED THIS WRAPPER: Centers the whole page
    <div className="game-page-container"> 

      {/* 2. ADDED THIS WRAPPER: This IS the white box */}
      <div className="game-content text-content">
    <>
      <h1>Contact Us</h1>

      <h2><i className="fas fa-envelope-open-text"></i> Get in Touch!</h2>
      <p>
        We value your feedback and inquiries. Whether you have a question 
        about a game, encountered a technical issue, want to suggest a 
        new game, or are a developer interested in partnering with us, 
        please don't hesitate to reach out.
      </p>

      <h2 style={{ marginTop: '3rem' }}>Email Us</h2>
      <p>For general questions, feedback, or support:</p>
      <p style={{ fontSize: '1.1rem', fontWeight: '500', textAlign: 'center' }}>
        {/* mailto: links are external, so they stay as <a> tags */}
        <a href="mailto:gamehubsite@gmail.com" style={{ color: 'var(--primary-color)' }}>
          gamehubsite@gmail.com
        </a>
      </p>

      <p style={{ marginTop: '2rem' }}>For game submissions or developer inquiries:</p>
      <p style={{ fontSize: '1.1rem', fontWeight: '500', textAlign: 'center' }}>
        <a href="mailto:gamehubsubmissions@gmail.com" style={{ color: 'var(--primary-color)' }}>
          gamehubsubmissions@gmail.com
        </a>
      </p>

      <p style={{ marginTop: '3rem' }}>
        We aim to respond to all messages within 48 business hours. 
        Thank you for visiting GameHub!
      </p>
    </>
    </div>
    </div>
  );
}

export default Contact;