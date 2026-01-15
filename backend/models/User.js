const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  weeklyUsage: {
    count: {
      type: Number,
      default: 0,
      min: 0,
      max: 4
    },
    weekStartDate: {
      type: Date,
      default: null
    },
    lastResetDate: {
      type: Date,
      default: null
    }
  },
  analysisHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Analysis'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'weeklyUsage.weekStartDate': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
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

// Method to compare password for login
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if user can create new analysis
userSchema.methods.canCreateAnalysis = function() {
  const now = new Date();
  const weekStartDate = this.weeklyUsage.weekStartDate;

  // If no week start date, user hasn't used the service yet
  if (!weekStartDate) {
    return true;
  }

  // Calculate days since week started
  const daysSinceWeekStart = Math.floor((now - weekStartDate) / (1000 * 60 * 60 * 24));

  // If more than 7 days, reset usage
  if (daysSinceWeekStart >= 7) {
    return true; // Will be reset in controller
  }

  // Check if under limit
  return this.weeklyUsage.count < 4;
};

// Method to increment usage count
userSchema.methods.incrementUsage = async function() {
  const now = new Date();
  const weekStartDate = this.weeklyUsage.weekStartDate;

  // If no week start or more than 7 days, start new week
  if (!weekStartDate || Math.floor((now - weekStartDate) / (1000 * 60 * 60 * 24)) >= 7) {
    this.weeklyUsage.count = 1;
    this.weeklyUsage.weekStartDate = now;
    this.weeklyUsage.lastResetDate = now;
  } else {
    // Increment count
    this.weeklyUsage.count += 1;
  }

  await this.save();
};

// Method to get days until reset
userSchema.methods.getDaysUntilReset = function() {
  if (!this.weeklyUsage.weekStartDate) {
    return 0;
  }

  const now = new Date();
  const weekStartDate = this.weeklyUsage.weekStartDate;
  const daysSinceWeekStart = Math.floor((now - weekStartDate) / (1000 * 60 * 60 * 24));
  const daysUntilReset = 7 - daysSinceWeekStart;

  return daysUntilReset > 0 ? daysUntilReset : 0;
};

// Method to get remaining analyses for the week
userSchema.methods.getRemainingAnalyses = function() {
  const now = new Date();
  const weekStartDate = this.weeklyUsage.weekStartDate;

  // If no week start or more than 7 days, full quota available
  if (!weekStartDate || Math.floor((now - weekStartDate) / (1000 * 60 * 60 * 24)) >= 7) {
    return 4;
  }

  return Math.max(0, 4 - this.weeklyUsage.count);
};

// Virtual for user profile (exclude sensitive data)
userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    email: this.email,
    weeklyUsage: {
      used: this.weeklyUsage.count,
      remaining: this.getRemainingAnalyses(),
      daysUntilReset: this.getDaysUntilReset()
    },
    createdAt: this.createdAt
  };
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
