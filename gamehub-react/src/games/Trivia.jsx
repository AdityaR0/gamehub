// src/games/Trivia.jsx

import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import '../assets/css/Trivia.css';

const GAME_ID = 'trivia';
const QUESTION_COUNT = 5; // Game still uses 5 questions per round

// --- Expanded Question Bank (15 Unique Questions) ---
const ALL_QUESTIONS = [
    { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correct: "Paris" },
    { question: "Which planet is known as the Red Planet?", options: ["Jupiter", "Mars", "Venus", "Saturn"], correct: "Mars" },
    { question: "What is 2 + 2 * 2?", options: ["6", "8", "4", "12"], correct: "6" },
    { question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"], correct: "Da Vinci" },
    { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: "Pacific" },
    { question: "What year did the first man walk on the moon?", options: ["1969", "1959", "1975", "1980"], correct: "1969" },
    { question: "Which chemical element has the symbol 'O'?", options: ["Gold", "Oxygen", "Osmium", "Iron"], correct: "Oxygen" },
    { question: "What language is spoken in Brazil?", options: ["Spanish", "French", "Portuguese", "Italian"], correct: "Portuguese" },
    { question: "How many sides does a hexagon have?", options: ["Four", "Five", "Six", "Seven"], correct: "Six" },
    { question: "What is the largest land animal?", options: ["Rhino", "African Elephant", "Giraffe", "Blue Whale"], correct: "African Elephant" },
    { question: "Which mountain range includes Mount Everest?", options: ["Andes", "Rockies", "Himalayas", "Alps"], correct: "Himalayas" },
    { question: "What is the primary ingredient in guacamole?", options: ["Tomato", "Chili Pepper", "Avocado", "Lime"], correct: "Avocado" },
    { question: "In computing, what does 'RAM' stand for?", options: ["Read Access Memory", "Random Access Module", "Run Active Mail", "Random Access Memory"], correct: "Random Access Memory" },
    { question: "What is the square root of 64?", options: ["6", "7", "8", "16"], correct: "8" },
    { question: "Which of these is a primate?", options: ["Koala", "Bat", "Lemur", "Panda"], correct: "Lemur" },
];

// Helper to select a random subset of questions
const getRandomQuestions = () => {
    // 1. Shuffle the entire question bank
    const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random());
    // 2. Return the requested number of questions (5 in this case)
    return shuffled.slice(0, QUESTION_COUNT);
};


function Trivia() {
    // Initialize state with a random subset of questions
    const [questions, setQuestions] = useState(getRandomQuestions);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [status, setStatus] = useState("Select the correct answer below.");
    const [gameActive, setGameActive] = useState(true);
    
    const { isAuthenticated, token, updateUser } = useContext(AuthContext); 
    const currentQuestion = questions[currentQuestionIndex];
    const isGameOver = currentQuestionIndex >= questions.length;

    const recordGameResult = useCallback(async (finalScore) => {
        // ... (record logic) ...
    }, [isAuthenticated, token, updateUser]);

    useEffect(() => {
        if (isGameOver) {
            setStatus(`Game Over! Final Score: ${score}/${questions.length}`);
            setGameActive(false);
            recordGameResult(score > questions.length / 2 ? 'win' : 'loss');
        }
    }, [isGameOver, score, questions.length, recordGameResult]);

    const handleAnswer = (answer) => {
        if (!gameActive || isAnswered) return;

        setSelectedAnswer(answer);
        setIsAnswered(true);

        if (answer === currentQuestion.correct) {
            setScore(s => s + 1);
            setStatus("✅ Correct!");
        } else {
            setStatus(`❌ Incorrect! The answer was: ${currentQuestion.correct}`);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) { 
            setCurrentQuestionIndex(i => i + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setStatus("Select the correct answer below.");
        } else {
             // Increment one last time to trigger the isGameOver effect
             setCurrentQuestionIndex(i => i + 1); 
        }
    };

    const handleReset = () => {
        // Get a brand new set of random questions on reset (autonomic change)
        setQuestions(getRandomQuestions()); 
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsAnswered(false);
        setSelectedAnswer(null);
        setStatus("Select the correct answer below.");
        setGameActive(true);
    };

    return (
        <div className="game-content">
            <h1>Trivia</h1>
            <div className="trv-container" id="trivia-game">

                <div className="trv-stats">
                    <span className="trv-stat-label">Score: {score}</span>
                    {/* Conditional status rendering to fix 4/3 issue */}
                    <span className="trv-stat-label">
                        {isGameOver 
                            ? `Total: ${questions.length}` 
                            : `Question: ${currentQuestionIndex + 1}/${questions.length}`
                        }
                    </span>
                </div>
                
                {/* Check if currentQuestion exists before trying to render */}
                {!isGameOver && currentQuestion && ( 
                    <>
                        <div className="trv-question-box">
                            {currentQuestion.question}
                        </div>

                        <div className="trv-options">
                            {currentQuestion.options.map(option => (
                                <button
                                    key={option}
                                    className={`trv-option-btn 
                                        ${isAnswered && option === currentQuestion.correct ? 'correct' : ''}
                                        ${isAnswered && option === selectedAnswer && option !== currentQuestion.correct ? 'incorrect' : ''}
                                    `}
                                    onClick={() => handleAnswer(option)}
                                    disabled={isAnswered || !gameActive}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                <h2 id="game-status" className="trv-game-status">{status}</h2>

                <button 
                    id="next-button"
                    className="trv-reset-btn" 
                    onClick={isGameOver ? handleReset : handleNext}
                    disabled={!isAnswered && !isGameOver}
                >
                    {isGameOver ? 'Play Again' : 'Next Question'}
                </button>
            </div>
        </div>
    );
}

export default Trivia;