import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import Provider
import { AuthProvider } from './context/AuthContext';

// Import CSS
import './assets/css/style.css';
import './assets/css/tic-tac-toe.css';
import './assets/css/StonePaperScissors.css';
import './assets/css/memory-game.css';
import './assets/css/WhacAMole.css';
import './assets/css/Snake.css';
import './assets/css/SlidingPuzzle.css';

import './assets/css/WordleGame.css';
// import './assets/css/ConnectFour.css';
import './assets/css/Game2048.css';
import './assets/css/Minesweeper.css';
import './assets/css/BubbleShooter.css';
import './assets/css/Sudoku.css';

import './assets/css/Mahjong.css';
// import './assets/css/Solitaire.css';
import './assets/css/Pong.css';
import './assets/css/FlappyBird.css';
import './assets/css/Tetris.css';
import './assets/css/PacMan.css';

import './assets/css/Chess.css';
import './assets/css/Checkers.css';
import './assets/css/Trivia.css';
import './assets/css/DinoRun.css';
import './assets/css/CookieClicker.css';
import './assets/css/Breakout.css';

import './assets/css/ComingSoon.css';
// ... import other game css if needed ...

// Import Layouts
import MainLayout from './components/MainLayout';
import GameLayout from './components/GameLayout'; 
// *** NEW: Import the DesktopGate component ***
import DesktopGate from './components/DesktopGate.jsx'; 

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Developers from './pages/Developers';
import Faq from './pages/Faq';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

// Import Games
import TicTacToe from './games/TicTacToe';
import StonePaperScissors from './games/StonePaperScissors.jsx';
import MemoryGame from './games/MemoryGame.jsx';
import WhacAMole from './games/WhacAMole.jsx';      
import Snake from './games/Snake.jsx';              
import SlidingPuzzle from './games/SlidingPuzzle.jsx'; 

import WordleGame from './games/WordleGame.jsx';
// import ConnectFour from './games/ConnectFour.jsx';
import Game2048 from './games/Game2048.jsx';
import Minesweeper from './games/Minesweeper.jsx';
import BubbleShooter from './games/BubbleShooter.jsx';
import Sudoku from './games/Sudoku.jsx';

import Mahjong from './games/Mahjong.jsx';
// import Solitaire from './games/Solitaire.jsx';
import Pong from './games/Pong.jsx';
import FlappyBird from './games/FlappyBird.jsx';
import Tetris from './games/Tetris.jsx';
import PacMan from './games/PacMan.jsx';

import Chess from './games/Chess.jsx';
import Checkers from './games/Checkers.jsx';
import Trivia from './games/Trivia.jsx';
import DinoRun from './games/DinoRun.jsx';
import CookieClicker from './games/CookieClicker.jsx';
import Breakout from './games/Breakout.jsx';

import ComingSoon from './games/ComingSoon.jsx';
// ... other games

const router = createBrowserRouter([
  {
    // --- Homepage Layout (Sidebar, Nav, Footer) ---
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
    ],
  },
  {
    // --- Main Sidebar Layout (Used for ALL other pages) ---
    element: <GameLayout />,
    children: [
      // Game Pages - ALL WRAPPED IN <DesktopGate>
      { path: '/game/tic-tac-toe', element: <DesktopGate><TicTacToe /></DesktopGate> },
      { path: '/game/stone-paper-scissors', element: <DesktopGate><StonePaperScissors /></DesktopGate> },
      { path: '/game/memory-game', element: <DesktopGate><MemoryGame /></DesktopGate> },
      { path: '/game/whac-a-mole', element: <DesktopGate><WhacAMole /></DesktopGate> }, 
      { path: '/game/snake', element: <DesktopGate><Snake /></DesktopGate> },          
      { path: '/game/puzzle', element: <DesktopGate><SlidingPuzzle /></DesktopGate> },

      { path: '/game/wordle', element: <DesktopGate><WordleGame /></DesktopGate> },
      // { path: '/game/connect-four', element: <DesktopGate><ConnectFour /></DesktopGate> },
      { path: '/game/2048', element: <DesktopGate><Game2048 /></DesktopGate> }, 
      { path: '/game/minesweeper', element: <DesktopGate><Minesweeper /></DesktopGate> },
      { path: '/game/bubble-shooter', element: <DesktopGate><BubbleShooter /></DesktopGate> },
      { path: '/game/sudoku', element: <DesktopGate><Sudoku /></DesktopGate> },

      { path: '/game/mahjong', element: <DesktopGate><Mahjong /></DesktopGate> },
      // { path: '/game/solitaire', element: <DesktopGate><Solitaire /></DesktopGate> },
      { path: '/game/pong', element: <DesktopGate><Pong /></DesktopGate> },
      { path: '/game/flappy-bird', element: <DesktopGate><FlappyBird /></DesktopGate> },
      { path: '/game/tetris', element: <DesktopGate><Tetris /></DesktopGate> },
      { path: '/game/pac-man', element: <DesktopGate><PacMan /></DesktopGate> },

      { path: '/game/chess', element: <DesktopGate><Chess /></DesktopGate> },
      { path: '/game/checkers', element: <DesktopGate><Checkers /></DesktopGate> },
      { path: '/game/trivia', element: <DesktopGate><Trivia /></DesktopGate> },
      { path: '/game/dino-run', element: <DesktopGate><DinoRun /></DesktopGate> },
      { path: '/game/cookie-clicker', element: <DesktopGate><CookieClicker /></DesktopGate> },
      { path: '/game/breakout', element: <DesktopGate><Breakout /></DesktopGate> },

      { path: '/game/:gameId', element: <ComingSoon />}, // Keep ComingSoon flexible for mobile

      // Auth Pages (Do NOT wrap these)
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/profile', element: <Profile /> },
      { path: '/reset-password/:token', element: <ResetPassword /> },

      // Static Text Pages (Do NOT wrap these)
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/privacy', element: <Privacy /> },
      { path: '/terms', element: <Terms /> },
      { path: '/cookies', element: <Cookies /> },
      { path: '/developers', element: <Developers /> },
      { path: '/faq', element: <Faq /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);