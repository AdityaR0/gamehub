// Add these standard Node.js imports for path manipulation in ES Modules
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables (dotenv installation is assumed)
// This path handles the server.js file being inside 'gamehub-react/server' 
// and looks up two levels to find the .env file in the root 'gamehub' folder.
import dotenv from 'dotenv';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '..', '.env') }); 

// --- Standard Imports ---
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';

// --- Model Imports ---
import User from './models/User.model.js'; 

// --- Configuration ---
const app = express();
// READ FROM .ENV: Use Render's provided port (process.env.PORT) or default to 3001
const PORT = process.env.PORT || 3001; 
// READ FROM .ENV: Security Keys
const JWT_SECRET = process.env.JWT_SECRET; 
const SESSION_SECRET = process.env.SESSION_SECRET; 
// READ FROM .ENV: Frontend URL (Crucial for CORS and redirects)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'; 

// --- Google OAuth Credentials (READ FROM .ENV) ---
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// --- Database Connection (READ FROM .ENV) ---
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully! 🚀'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Middleware ---
app.use(cors({
    origin: FRONTEND_URL, 
    credentials: true 
}));
app.use(express.json());

// --- Session Setup ---
app.use(session({
    secret: SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
}));

// --- Passport Initialization ---
app.use(passport.initialize());
app.use(passport.session());

// --- Passport Google Strategy ---
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback", 
    scope: ['profile', 'email']
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
                return done(null, user);
            } else {
                const newUser = new User({
                    name: profile.displayName || "User",
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(16).toString('hex') 
                });
                const savedUser = await newUser.save();
                return done(null, savedUser);
            }
        } catch (err) {
            console.error("Server: Google Strategy - Error:", err);
            return done(err, null);
        }
    }
));

// --- Passport Serialization/Deserialization ---
passport.serializeUser((user, done) => { done(null, user.id); });

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user); 
    } catch (err) {
        done(err, null);
    }
});

// --- Authentication Middleware (JWT Protection) ---
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password'); 
            if (!req.user) { throw new Error('User not found'); }
            next();
        } catch (error) {
            console.error('Server: Protect Middleware - Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else { 
        res.status(401).json({ message: 'Not authorized, no token or wrong format' });
    }
};

// --- Nodemailer Setup (READ FROM .ENV) ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// =================================================================
// --- API Routes ---
// =================================================================

app.get('/', (req, res) => { res.send('Hello from the GameHub Server!'); });

// 1. REGISTER A NEW USER
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
        if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

        const existingUser = await User.findOne({ email: email });
        if (existingUser) return res.status(400).json({ message: 'Email already in use' });

        const newUser = new User({ name, email, password });
        const savedUser = await newUser.save();
        res.status(201).json({
            message: 'User created successfully!',
            user: { id: savedUser._id, name: savedUser.name, email: savedUser.email }
        });
    } catch (error) {
        console.error('Server: /api/register - FAILED:', error); 
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
});

// 2. LOGIN A USER
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            message: 'Logged in successfully!',
            token: token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Server: /api/login - FAILED:', error); 
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
});

// 3. INITIATE PASSWORD RESET (Forgot Password)
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ message: 'If an account exists for that email, a password reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetURL = `${FRONTEND_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'GameHub Password Reset Request',
            html: `
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                <a href="${resetURL}">Reset Password Link</a>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'If an account exists for that email, a password reset link has been sent.' });

    } catch (error) {
        console.error('Server: /api/forgot-password - FAILED:', error);
        res.status(500).json({ message: 'Error processing password reset request.', error: error.message });
    }
});

// 4. PROCESS PASSWORD RESET (Reset Password)
app.post('/api/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters.' });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        user.password = password; 
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Your password has been successfully updated!' });

    } catch (error) {
        console.error('Server: /api/reset-password/:token - FAILED:', error);
        res.status(500).json({ message: 'Error processing new password.', error: error.message });
    }
});

// 5. GET LOGGED-IN USER'S DETAILS
app.post('/api/me', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password -resetPasswordToken -resetPasswordExpires');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);

    } catch (error) {
        console.error("Server: /api/me - FAILED:", error.name, error.message);
        const status = error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' ? 401 : 500;
        res.status(status).json({ message: 'Authentication failed or server error' });
    }
});


// 6. RECORD GAME RESULT (Protected Route)
app.post('/api/stats/record', protect, async (req, res) => {
    try {
        const { result } = req.body;
        
        if (!result) {
            return res.status(400).json({ message: 'Game result is required.' });
        }
        
        const user = req.user; 

        if (!user.gameStats) {
            user.gameStats = { totalPlayed: 0, wins: 0, losses: 0, draws: 0 };
        }
        if (!user.favoriteGames) {
            user.favoriteGames = [];
        }
        
        user.gameStats.totalPlayed = (user.gameStats.totalPlayed || 0) + 1; 
        
        if (result === 'win') {
            user.gameStats.wins = (user.gameStats.wins || 0) + 1;
        } else if (result === 'loss') {
            user.gameStats.losses = (user.gameStats.losses || 0) + 1;
        } else if (result === 'draw') {
            user.gameStats.draws = (user.gameStats.draws || 0) + 1;
        }
        
        const updatedUser = await user.save();
        
        res.status(200).json({ 
            message: 'Game result recorded!', 
            user: updatedUser 
        });

    } catch (error) {
        console.error('Server: /api/stats/record - CRITICAL FAILURE:', error);
        res.status(500).json({ message: 'Server error while recording stats.' });
    }
});


// 7. ADD A FAVORITE GAME (Protected Route)
app.post('/api/favorites/add', protect, async (req, res) => {
    try {
        const { gameId } = req.body;
        const user = req.user; 
        
        if (!gameId) return res.status(400).json({ message: 'Game ID is required.' });

        if (!user.favoriteGames) { user.favoriteGames = []; } 

        if (!user.favoriteGames.includes(gameId)) {
            user.favoriteGames.push(gameId);
            const updatedUser = await user.save();
            return res.status(200).json({ message: 'Game added to favorites.', user: updatedUser });
        }
        
        res.status(200).json({ message: 'Game already in favorites.', user: user });
    } catch (error) {
        console.error('Server: /api/favorites/add - FAILED:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// 8. REMOVE A FAVORITE GAME (Protected Route)
app.post('/api/favorites/remove', protect, async (req, res) => {
    try {
        const { gameId } = req.body;
        const user = req.user; 
        
        if (!gameId) return res.status(400).json({ message: 'Game ID is required.' });

        user.favoriteGames = (user.favoriteGames || []).filter(id => id !== gameId);

        const updatedUser = await user.save();
        
        res.status(200).json({ message: 'Game removed from favorites.', user: updatedUser });
    } catch (error) {
        console.error('Server: /api/favorites/remove - FAILED:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});


// --- Google OAuth Routes ---
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { 
        failureRedirect: `${FRONTEND_URL}/login` 
    }),
    (req, res) => {
        const token = jwt.sign( { userId: req.user._id, email: req.user.email }, JWT_SECRET, { expiresIn: '1d' });
        res.redirect(`${FRONTEND_URL}/?token=${token}`);
    }
);


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});