// src/gamesData.js

export const gamesData = [
// --- GAMES 1 - 24: ACTIVE GAMES ---
  { id: 'tic-tac-toe', title: 'Tic Tac Toe', path: '/game/tic-tac-toe', img: '/images/tic-tac-toe.png', tags: ['2 Player', 'Puzzle'] },
  { id: 'sps', title: 'Stone Paper Scissors', path: '/game/stone-paper-scissors', img: '/images/sps.png', tags: ['2 Player', 'Action'] },
  { id: 'memory', title: 'Memory Game', path: '/game/memory-game', img: '/images/memory-game.png', tags: ['Puzzle'] },
  { id: 'whac-a-mole', title: 'Whac a Mole', path: '/game/whac-a-mole', img: '/images/whac-a-mole.png', tags: ['Action'] },
  { id: 'snake', title: 'Snake', path: '/game/snake', img: '/images/snake.jpg', tags: ['Action'] },
  { id: 'puzzle', title: 'Sliding Puzzle', path: '/game/puzzle', img: '/images/puzzle.png', tags: ['Puzzle'] },
  
  { id: 'wordle', title: 'Word Game', path: '/game/wordle', img: '/images/wordle.jpg', tags: ['Puzzle'] },
  { id: 'connect-four', title: 'Connect Four', path: '/game/connect-four', img: '/images/connect-four.png', tags: ['2 Player', 'Puzzle'] },
  { id: '2048', title: '2048', path: '/game/2048', img: '/images/2048.png', tags: ['Puzzle'] },
  { id: 'minesweeper', title: 'Minesweeper', path: '/game/minesweeper', img: '/images/minesweeper.png', tags: ['Puzzle'] },
  { id: 'bubble-shooter', title: 'Bubble Shooter', path: '/game/bubble-shooter', img: '/images/bubble-shooter.png', tags: ['Shooting', 'Action'] },
  { id: 'sudoku', title: 'Sudoku', path: '/game/sudoku', img: '/images/sudoku.png', tags: ['Puzzle'] },
  
  { id: 'mahjong', title: 'Mahjong', path: '/game/mahjong', img: '/images/mahjong.png', tags: ['Puzzle'] },
  { id: 'solitaire', title: 'Solitaire', path: '/game/solitaire', img: '/images/solitaire.png', tags: ['Puzzle'] },
  { id: 'pong', title: 'Pong', path: '/game/pong', img: '/images/pong.png', tags: ['2 Player', 'Sports'] },
  { id: 'flappy-bird', title: 'Flappy Bird', path: '/game/flappy-bird', img: '/images/flappy-bird.png', tags: ['Action'] },
  { id: 'tetris', title: 'Tetris', path: '/game/tetris', img: '/images/tetris.png', tags: ['Puzzle'] },
  { id: 'pac-man', title: 'Pac-Man', path: '/game/pac-man', img: '/images/pac-man.png', tags: ['Action'] },
  
  { id: 'chess', title: 'Chess', path: '/game/chess', img: '/images/chess.png', tags: ['2 Player', 'Puzzle'] },
  { id: 'checkers', title: 'Checkers', path: '/game/checkers', img: '/images/checkers.png', tags: ['2 Player', 'Puzzle'] },
  { id: 'trivia', title: 'Trivia', path: '/game/trivia', img: '/images/trivia.png', tags: ['Puzzle'] },
  { id: 'dino-run', title: 'Dino Run', path: '/game/dino-run', img: '/images/dino-run.png', tags: ['Action'] },
  { id: 'cookie-clicker', title: 'Cookie Clicker', path: '/game/cookie-clicker', img: '/images/cookie-clicker.png', tags: ['Clicker'] },
  { id: 'breakout', title: 'Breakout', path: '/game/breakout', img: '/images/breakout.png', tags: ['Action'] },

// --- GAMES 25+ : COMING SOON ---
  { id: 'uno', title: 'Uno', path: '/game/uno', img: '/images/uno.png', tags: ['2 Player'] },
  { id: 'ludo', title: 'Ludo', path: '/game/ludo', img: '/images/ludo.png', tags: ['2 Player'] },
  { id: 'car-racing', title: 'Car Racing', path: '/game/car-racing', img: '/images/car-racing.png', tags: ['Car', 'Action'] },
  { id: 'moto-x3m', title: 'Moto X3M', path: '/game/moto-x3m', img: '/images/moto-x3m.png', tags: ['Car', 'Action'] },
  { id: 'subway-surfers', title: 'Subway Surfers', path: '/game/subway-surfers', img: '/images/subway-surfers.png', tags: ['Action'] },
  { id: 'temple-run', title: 'Temple Run', path: '/game/temple-run', img: '/images/temple-run.png', tags: ['Action'] },

  { id: 'hanoi', title: 'Tower of Hanoi', path: '/game/hanoi', img: '/images/hanoi.png', tags: ['Puzzle'] },
  { id: 'mastermind', title: 'Mastermind', path: '/game/mastermind', img: '/images/mastermind.png', tags: ['Puzzle'] },
  { id: 'hangman', title: 'Hangman', path: '/game/hangman', img: '/images/hangman.png', tags: ['Puzzle'] },
  { id: 'crossword', title: 'Mini Crossword', path: '/game/crossword', img: '/images/crossword.png', tags: ['Puzzle'] },
  { id: 'simon', title: 'Simon Says', path: '/game/simon', img: '/images/simon.png', tags: ['Memory', 'Action'] },
  { id: 'guess-num', title: 'Guess The Number', path: '/game/guess-num', img: '/images/guess-num.png', tags: ['Puzzle'] },
  
  { id: 'calculator', title: 'Math Calculator', path: '/game/calculator', img: '/images/calculator.png', tags: ['Puzzle'] },
  { id: 'color-match', title: 'Color Match', path: '/game/color-match', img: '/images/color-match.png', tags: ['Puzzle'] },
  { id: 'word-search', title: 'Word Search', path: '/game/word-search', img: '/images/word-search.png', tags: ['Puzzle'] },
  { id: 'typing-game', title: 'Typing Test', path: '/game/typing-game', img: '/images/typing.png', tags: ['Action'] },
  { id: 'tic-8x8', title: 'Big Tic Tac Toe', path: '/game/tic-8x8', img: '/images/tic-8x8.png', tags: ['2 Player', 'Puzzle'] },
  { id: 'darts', title: 'Darts', path: '/game/darts', img: '/images/darts.png', tags: ['Sports'] },
  
  { id: 'bowling', title: 'Bowling', path: '/game/bowling', img: '/images/bowling.png', tags: ['Sports'] },
  { id: 'mini-golf', title: 'Mini Golf', path: '/game/mini-golf', img: '/images/mini-golf.png', tags: ['Sports'] },
  { id: 'crush', title: 'Candy Crush Clone', path: '/game/crush', img: '/images/crush.png', tags: ['Puzzle'] },
  { id: 'bejeweled', title: 'Bejeweled Clone', path: '/game/bejeweled', img: '/images/bejeweled.png', tags: ['Puzzle'] },
  { id: 'pinball', title: 'Pinball', path: '/game/pinball', img: '/images/pinball.png', tags: ['Action'] },
  { id: 'platformer', title: 'Mini Platformer', path: '/game/platformer', img: '/images/platformer.png', tags: ['Action'] },
];



  
export const categoryTags = [
  'All', '2 Player', 'Puzzle', 'Action', 'Car', 'Shooting', 'Sports', 'Memory'
];