import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- FAQ Data (UPDATED) ---
const faqData = [
  {
    question: "Are all games on GameHub free to play?",
    answer: "Yes! Absolutely. All games currently featured on GameHub are 100% free to play directly in your browser. No hidden costs, no subscriptions needed."
  },
  {
    question: "Do I need to download or install anything?",
    answer: "No downloads, no installations required! Every game on our site runs using standard web technologies (HTML5) directly in modern web browsers like Chrome, Firefox, Safari, and Edge."
  },
  {
    question: "Do the games save my progress or high scores?",
    answer: "Most of the simple games currently on GameHub do not save your progress if you close the browser tab or window. Some games might use your browser's local storage to remember your high score on that specific device, but this data can be cleared if you clear your browser's cache."
  },
  {
    question: "Is GameHub safe for children?",
    answer: "We strive to curate a collection of games suitable for a general audience, including families and children. We actively avoid games with graphic violence, mature themes, or inappropriate content. However, as with any online activity, we always recommend parental guidance."
  },
  {
    question: "A game isn't loading or working correctly. What can I do?",
    answer: (
      <>
        <p>We're sorry to hear that! Here are a few things to try:</p>
        <ul>
          <li>Ensure you have a stable internet connection.</li>
          <li>Try refreshing the page (Ctrl+R or Cmd+R).</li>
          <li>Try clearing your browser's cache and cookies for our site.</li>
          <li>Make sure your web browser is up-to-date.</li>
        </ul>
        <p>
          If the problem persists, please use our 
          <Link to="/contact" style={{ color: 'var(--primary-color)' }}> Contact page </Link>
          to let us know! Include the name of the game, the browser 
          you're using (e.g., Chrome on Windows), and a description 
          of the issue. We'll investigate!
        </p>
      </>
    )
  },
  {
    question: "Can I play these games on my mobile or tablet?",
    answer: (
        <>
            <p><strong>Yes, you can browse the website and access your account on any device.</strong></p>
            <p>However, due to the complex controls, screen size requirements, or reliance on keyboard input for many of our games (like Tetris, Dino Run, or Chess), **gameplay is restricted on mobile phones.**</p>
            <p>You will receive a notification prompting you to switch to a **desktop computer, laptop, or tablet** before starting a game.</p>
        </>
    )
  }
];


// --- The Component ---
function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    // 1. ADDED: Outer wrapper for centering/page styling
    <div className="game-page-container">

      {/* 2. ADDED: Inner wrapper for the white box and text-based styling */}
      <div className="game-content text-content">

        <h1>Frequently Asked Questions</h1>

        <div className="faq-list">
          {/* We now loop over our data array to create the items */}
          {faqData.map((item, index) => (
            <div
              // The class is now dynamic based on our state
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              key={index}
            >
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{item.question}</span>
                {/* The icon class should be controlled by CSS for rotation, but we use the existing one */}
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className="faq-answer">
                {/* This handles both simple text and complex JSX answers */}
                {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
              </div>
            </div>
          ))}
        </div>

      </div> 
    </div>   
  );
}

export default Faq;