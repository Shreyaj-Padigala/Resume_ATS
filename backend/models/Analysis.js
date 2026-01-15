const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Keywords', 'Formatting', 'Experience', 'Skills', 'Education', 'Summary', 'Action Verbs', 'Quantification', 'Other']
  },
  priority: {
    type: String,
    required: true,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  suggestion: {
    type: String,
    required: true
  },
  implemented: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const versionSchema = new mongoose.Schema({
  versionNumber: {
    type: Number,
    required: true
  },
  resumeText: {
    type: String,
    required: true
  },
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  improvementNotes: {
    type: String
  }
}, { _id: true });

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  jobTitle: {
    type: String,
    trim: true,
    default: 'Untitled Position'
  },
  jobDescription: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true
  },
  resumeText: {
    type: String,
    required: [true, 'Resume text is required']
  },
  resumeFileName: {
    type: String,
    default: 'resume.pdf'
  },
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  suggestions: [suggestionSchema],
  versions: [versionSchema],
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  completedAt: {
    type: Date
  },
  // AI analysis metadata
  analysisMetadata: {
    modelUsed: {
      type: String,
      default: 'groq-api'
    },
    processingTime: {
      type: Number // in milliseconds
    },
    keywordsFound: [{
      keyword: String,
      count: Number
    }],
    missingKeywords: [String]
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for better query performance
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ status: 1 });
analysisSchema.index({ atsScore: 1 });

// Virtual for current version number
analysisSchema.virtual('currentVersion').get(function() {
  return this.versions.length;
});

// Virtual for score improvement
analysisSchema.virtual('scoreImprovement').get(function() {
  if (this.versions.length < 2) {
    return 0;
  }
  const firstScore = this.versions[0].atsScore;
  const currentScore = this.atsScore;
  return currentScore - firstScore;
});

// Method to add a new version
analysisSchema.methods.addVersion = async function(resumeText, atsScore, improvementNotes = '') {
  const newVersion = {
    versionNumber: this.versions.length + 1,
    resumeText,
    atsScore,
    timestamp: new Date(),
    improvementNotes
  };

  this.versions.push(newVersion);
  this.resumeText = resumeText; // Update current resume text
  this.atsScore = atsScore; // Update current score

  await this.save();
  return newVersion;
};

// Method to mark analysis as completed
analysisSchema.methods.complete = async function() {
  this.status = 'completed';
  this.completedAt = new Date();
  await this.save();
};

// Method to get analysis summary
analysisSchema.methods.getSummary = function() {
  return {
    id: this._id,
    jobTitle: this.jobTitle,
    atsScore: this.atsScore,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    versionsCount: this.versions.length,
    highPrioritySuggestions: this.suggestions.filter(s => s.priority === 'High').length,
    implementedSuggestions: this.suggestions.filter(s => s.implemented).length,
    totalSuggestions: this.suggestions.length,
    scoreImprovement: this.scoreImprovement
  };
};

// Method to get high priority suggestions
analysisSchema.methods.getHighPrioritySuggestions = function() {
  return this.suggestions
    .filter(s => s.priority === 'High' && !s.implemented)
    .sort((a, b) => a.category.localeCompare(b.category));
};

// Method to mark suggestion as implemented
analysisSchema.methods.implementSuggestion = async function(suggestionId) {
  const suggestion = this.suggestions.id(suggestionId);
  if (suggestion) {
    suggestion.implemented = true;
    await this.save();
    return suggestion;
  }
  return null;
};

// Pre-save hook to ensure first version is always created
analysisSchema.pre('save', function(next) {
  // If this is a new analysis and no versions exist, create the first version
  if (this.isNew && this.versions.length === 0) {
    this.versions.push({
      versionNumber: 1,
      resumeText: this.resumeText,
      atsScore: this.atsScore,
      timestamp: new Date(),
      improvementNotes: 'Initial analysis'
    });
  }
  next();
});

// Static method to get user's analysis history with pagination
analysisSchema.statics.getUserAnalyses = async function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const analyses = await this.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('jobTitle atsScore status createdAt updatedAt');

  const total = await this.countDocuments({ userId });

  return {
    analyses,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAnalyses: total,
      hasMore: skip + analyses.length < total
    }
  };
};

// Static method to get analytics for a user
analysisSchema.statics.getUserAnalytics = async function(userId) {
  const analyses = await this.find({ userId });

  const totalAnalyses = analyses.length;
  const avgScore = totalAnalyses > 0
    ? analyses.reduce((sum, a) => sum + a.atsScore, 0) / totalAnalyses
    : 0;

  const completedAnalyses = analyses.filter(a => a.status === 'completed').length;
  const inProgressAnalyses = analyses.filter(a => a.status === 'in-progress').length;

  return {
    totalAnalyses,
    completedAnalyses,
    inProgressAnalyses,
    averageScore: Math.round(avgScore * 10) / 10,
    highestScore: totalAnalyses > 0 ? Math.max(...analyses.map(a => a.atsScore)) : 0,
    lowestScore: totalAnalyses > 0 ? Math.min(...analyses.map(a => a.atsScore)) : 0
  };
};

// Ensure virtuals are included in JSON
analysisSchema.set('toJSON', { virtuals: true });
analysisSchema.set('toObject', { virtuals: true });

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;
