import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'], // Still required for email/password users
    minlength: [6, 'Password must be at least 6 characters long']
  },
  
  // --- Password Reset Fields ---
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  // --- NEW: Game Statistics ---
  gameStats: {
    totalPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 }
  },
  
  // --- NEW: Favorite Games ---
  // We'll store an array of game IDs (like 'tic-tac-toe')
  favoriteGames: [{ type: String }] 

}, {
  timestamps: true 
});


// --- Password Hashing Middleware (Unchanged) ---
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

export default User;