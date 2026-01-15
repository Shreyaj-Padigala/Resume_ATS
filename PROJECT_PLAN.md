# Resume ATS Analyzer - Project Plan

## Project Overview
An AI-powered resume improvement app that analyzes resumes against job descriptions using the GroqCloud API, providing ATS scores and actionable suggestions for improvement.

---

## Core Features

### 1. User Authentication
- **Sign Up**: Email/password registration with validation
- **Login**: Secure authentication with JWT tokens
- **Session Management**: Persistent login sessions
- **Password Security**: Bcrypt hashing for passwords

### 2. Usage Limits
- **Free Tier**: 4 resume analyses per week
- **Weekly Reset**: 7 days from first analysis of the week
- **Usage Tracking**: Real-time counter display
- **Limit Enforcement**: Block new analyses when limit reached

### 3. Resume Analysis Workflow
**Step 1: Upload & Input**
- Upload PDF resume (file size limit: 5MB)
- Paste job description text
- Validate inputs before processing

**Step 2: AI Analysis**
- Parse PDF content
- Send resume + job description to GroqCloud API
- Generate ATS score (0-100)
- Provide detailed suggestions for improvement

**Step 3: Iterative Improvement**
- Apply AI suggestions
- Re-analyze updated resume
- Real-time score updates (like Grammarly)
- Track improvement progress

**Step 4: Save & Exit**
- Save analysis to database
- Associate with user account
- Decrement weekly usage count

### 4. Analysis History
- View all past analyses
- Display: date, job title, score, status
- Access full details of each analysis
- Available even after weekly limit reached

### 5. Limit Reached State
- Display friendly message about limit
- Show time until next reset
- Allow access to past analyses
- Suggest upgrade options (future premium tier)

---

## Technical Architecture

### Technology Stack

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Authentication**: JWT + bcrypt
- **File Processing**: pdf-parse
- **AI Integration**: GroqCloud API

#### Frontend (Recommended)
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context or Zustand
- **HTTP Client**: Axios
- **File Upload**: react-dropzone

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date,
  weeklyUsage: {
    count: Number (default: 0, max: 4),
    weekStartDate: Date,
    lastResetDate: Date
  },
  analysisHistory: [ObjectId] // References to Analysis documents
}
```

#### Analyses Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  resumeText: String,
  jobDescription: String,
  atsScore: Number (0-100),
  suggestions: [
    {
      category: String, // e.g., "Keywords", "Formatting", "Experience"
      priority: String, // "High", "Medium", "Low"
      suggestion: String,
      implemented: Boolean (default: false)
    }
  ],
  versions: [
    {
      versionNumber: Number,
      resumeText: String,
      atsScore: Number,
      timestamp: Date
    }
  ],
  status: String, // "in-progress", "completed"
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/signup          - Create new user account
POST   /api/auth/login           - Authenticate user
POST   /api/auth/logout          - End user session
GET    /api/auth/me              - Get current user info
```

### Resume Analysis
```
POST   /api/analysis/create      - Start new analysis (upload resume + job desc)
POST   /api/analysis/:id/update  - Re-analyze with improvements
GET    /api/analysis/:id         - Get specific analysis details
DELETE /api/analysis/:id         - Delete analysis
```

### User Dashboard
```
GET    /api/user/analyses        - Get all user's analyses (paginated)
GET    /api/user/usage           - Get current usage stats
```

---

## Implementation Phases

### Phase 1: Backend Foundation (Week 1)
- [x] Set up MongoDB Atlas cluster
- [ ] Initialize Node.js/Express project
- [ ] Create Mongoose models (User, Analysis)
- [ ] Implement MongoDB connection
- [ ] Set up environment configuration
- [ ] Create authentication middleware (JWT)

### Phase 2: Authentication System (Week 1-2)
- [ ] Build signup endpoint with validation
- [ ] Build login endpoint with JWT generation
- [ ] Implement password hashing (bcrypt)
- [ ] Create auth middleware for protected routes
- [ ] Add logout functionality

### Phase 3: Core Analysis Features (Week 2-3)
- [ ] Integrate pdf-parse for resume extraction
- [ ] Set up GroqCloud API integration
- [ ] Build analysis creation endpoint
- [ ] Implement ATS scoring logic
- [ ] Create suggestion generation system
- [ ] Build re-analysis endpoint for improvements

### Phase 4: Usage Tracking (Week 3)
- [ ] Implement weekly usage counter
- [ ] Build automatic weekly reset logic (cron job)
- [ ] Add usage validation middleware
- [ ] Create usage stats endpoint
- [ ] Handle limit-reached scenarios

### Phase 5: Analysis History (Week 3-4)
- [ ] Build analysis retrieval endpoints
- [ ] Implement pagination for history
- [ ] Add filtering/sorting options
- [ ] Create analysis detail view
- [ ] Build delete functionality

### Phase 6: Frontend Development (Week 4-6)
- [ ] Set up React app with Vite
- [ ] Create authentication pages (login/signup)
- [ ] Build file upload component
- [ ] Create analysis dashboard
- [ ] Build real-time score display
- [ ] Implement suggestions UI
- [ ] Create history view
- [ ] Add usage limit displays

### Phase 7: Testing & Deployment (Week 6-7)
- [ ] Write unit tests for backend
- [ ] Write integration tests
- [ ] Frontend testing (Jest/React Testing Library)
- [ ] Set up CI/CD pipeline
- [ ] Deploy backend (Render/Railway/Vercel)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Configure production MongoDB Atlas

---

## MongoDB Atlas Setup Steps

### 1. Create Cluster
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Choose cloud provider and region (closest to users)
4. Name cluster: `resume-ats-cluster`

### 2. Configure Network Access
1. Go to Network Access in Atlas dashboard
2. Add IP Address: `0.0.0.0/0` (allow all - restrict in production)
3. Or add specific IP addresses for security

### 3. Create Database User
1. Go to Database Access
2. Create user with username/password
3. Grant read/write permissions
4. Save credentials securely

### 4. Get Connection String
1. Click "Connect" on cluster
2. Choose "Connect your application"
3. Copy connection string
4. Format: `mongodb+srv://<username>:<password>@resume-ats-cluster.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority`

### 5. Environment Configuration
Create `.env` file with:
```
MONGODB_URI=mongodb+srv://username:password@resume-ats-cluster.xxxxx.mongodb.net/resume-ats?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
GROQ_API_KEY=your-groq-api-key
PORT=5000
NODE_ENV=development
```

---

## Security Considerations

### Authentication
- Use HTTPS in production
- Implement rate limiting on auth endpoints
- Add email verification for signups
- Implement password reset flow
- Use secure JWT secret (256-bit minimum)

### Data Protection
- Never store plain text passwords
- Sanitize user inputs
- Validate file uploads (type, size)
- Implement CORS properly
- Use helmet.js for HTTP headers

### Database
- Use MongoDB Atlas encryption at rest
- Enable audit logs
- Restrict network access by IP
- Use strong database passwords
- Regular backups

---

## Future Enhancements

### Premium Features
- Unlimited analyses
- Advanced AI suggestions
- Multiple resume versions
- Cover letter generation
- LinkedIn profile optimization

### Additional Features
- Resume templates
- Export to PDF/DOCX
- Share analysis results
- Interview preparation tips
- Job matching recommendations
- Browser extension

---

## Environment Variables Needed

```bash
# MongoDB
MONGODB_URI=<your-mongodb-atlas-connection-string>

# JWT Authentication
JWT_SECRET=<random-secure-string>
JWT_EXPIRE=7d

# GroqCloud API
GROQ_API_KEY=<your-groq-api-key>
GROQ_MODEL=mixtral-8x7b-32768

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=5242880 # 5MB in bytes

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000 # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Folder Structure

```
Resume_ATS/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── env.js             # Environment config
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Analysis.js        # Analysis schema
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   ├── analysis.js        # Analysis endpoints
│   │   └── user.js            # User endpoints
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   ├── usageLimit.js      # Weekly limit check
│   │   └── errorHandler.js    # Error handling
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── analysisController.js
│   │   └── userController.js
│   ├── services/
│   │   ├── groqService.js     # GroqCloud integration
│   │   ├── pdfService.js      # PDF parsing
│   │   └── atsService.js      # ATS scoring logic
│   ├── utils/
│   │   ├── validators.js      # Input validation
│   │   └── helpers.js         # Helper functions
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── README.md
└── PROJECT_PLAN.md            # This file
```

---

## Success Metrics

### Technical Metrics
- API response time < 2 seconds
- 99.9% uptime
- Zero security vulnerabilities
- Test coverage > 80%

### User Metrics
- User signup conversion rate
- Average analyses per user
- Score improvement rate
- User retention (weekly active users)

---

## Notes & Considerations

1. **GroqCloud API Costs**: Monitor API usage and implement caching where possible
2. **PDF Parsing**: Some complex PDFs may not parse correctly - need fallback
3. **Weekly Reset Logic**: Use cron job or scheduled function to reset counters
4. **Scalability**: MongoDB Atlas M0 free tier has limits - plan for upgrade
5. **File Storage**: Consider using cloud storage (AWS S3) for uploaded PDFs instead of storing in DB
6. **Email Service**: Future feature for notifications (Sendgrid/Mailgun)

---

## Getting Started

1. Follow MongoDB Atlas setup steps above
2. Clone repository and create `.env` file
3. Install backend dependencies: `cd backend && npm install`
4. Start backend server: `npm run dev`
5. Install frontend dependencies: `cd frontend && npm install`
6. Start frontend: `npm run dev`
7. Access app at `http://localhost:5173`

---

**Created**: January 15, 2026
**Last Updated**: January 15, 2026
**Version**: 1.0
