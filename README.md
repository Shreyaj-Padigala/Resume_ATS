# Resume ATS - AI-Powered Resume Analyzer

An intelligent resume improvement application that analyzes resumes against job descriptions using AI, providing ATS scores and actionable suggestions to improve your chances of landing interviews.

## Overview

Resume ATS helps job seekers optimize their resumes by:
- Analyzing resume-job description match with AI
- Providing ATS scores (0-100)
- Offering specific, actionable improvement suggestions
- Tracking improvements in real-time (like Grammarly for resumes)
- Maintaining history of all past analyses

## Key Features

- **AI-Powered Analysis:** Uses GroqCloud API for intelligent resume evaluation
- **ATS Scoring:** Get a score from 0-100 based on job fit and keyword matching
- **Smart Suggestions:** Receive categorized suggestions (Keywords, Formatting, Experience, etc.)
- **Iterative Improvement:** Re-analyze as you make changes and watch your score improve
- **Usage Tracking:** Free tier includes 4 analyses per week
- **Analysis History:** Access all your past analyses anytime
- **User Authentication:** Secure login/signup system

## Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - Database ODM
- **JWT** - Authentication
- **GroqCloud API** - AI analysis
- **pdf-parse** - Resume parsing

### Frontend
- **React.js** with Vite - Modern build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Project Status

🚧 **Currently in development**

### Completed
- [x] MongoDB Atlas database configuration
- [x] User and Analysis data models
- [x] Database connection setup
- [x] Project structure and architecture
- [x] Comprehensive project plan
- [x] Frontend application with React + Vite
- [x] Authentication UI (Login/Signup)
- [x] Dashboard and analytics
- [x] Resume upload interface
- [x] Analysis results visualization
- [x] History tracking

### In Progress
- [ ] Authentication endpoints
- [ ] Resume analysis endpoints
- [ ] GroqCloud API integration
- [ ] PDF processing

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MongoDB Atlas account
- GroqCloud API key

### 1. Set Up MongoDB Atlas

Follow the detailed guide: [MONGODB_SETUP.md](MONGODB_SETUP.md)

This will walk you through:
- Creating a free MongoDB Atlas cluster
- Configuring database access
- Getting your connection string

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-secret-key
GROQ_API_KEY=your-groq-api-key
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs at: `http://localhost:5000`

### 5. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 6. Configure Frontend Environment

```bash
cp .env.example .env
```

The default configuration connects to the backend at `http://localhost:5000`.

### 7. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

- Backend API: `http://localhost:5000`
- Frontend App: `http://localhost:5173`

### 8. Test the Setup

- Backend health check: `http://localhost:5000/health`
- Backend database test: `http://localhost:5000/api/test-db`
- Frontend application: `http://localhost:5173`

## Documentation

- [Project Plan](PROJECT_PLAN.md) - Comprehensive development roadmap
- [MongoDB Setup Guide](MONGODB_SETUP.md) - Step-by-step database setup
- [Backend README](backend/README.md) - Backend documentation
- [Frontend README](frontend/README.md) - Frontend documentation

## How It Works

1. **Sign Up/Login:** Create an account or log in
2. **Upload Resume:** Upload your resume PDF
3. **Add Job Description:** Paste the job description
4. **Get Analysis:** Receive ATS score and suggestions
5. **Improve:** Make changes based on AI suggestions
6. **Re-analyze:** See your score improve in real-time
7. **Review History:** Access past analyses anytime

## Usage Limits

**Free Tier:**
- 4 resume analyses per week
- Resets every 7 days from first analysis
- Unlimited access to past analyses
- View-only mode when limit reached

## Database Schema

### User Collection
- Email and hashed password
- Weekly usage tracking (count, reset dates)
- Analysis history references

### Analysis Collection
- Resume text and job description
- ATS score (0-100)
- AI-generated suggestions with priority levels
- Version history for iterative improvements
- Status tracking (in-progress, completed)

## Security

- Password hashing with bcrypt
- JWT-based authentication
- CORS configuration
- Rate limiting
- Input validation
- MongoDB Atlas encryption

## Roadmap

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for detailed implementation phases.

### Phase 1: Backend Foundation (Current)
- MongoDB Atlas setup ✅
- User authentication
- Core analysis features

### Phase 2: AI Integration
- GroqCloud API integration
- PDF parsing
- ATS scoring algorithm

### Phase 3: Frontend Development ✅
- React application ✅
- User interface ✅
- Real-time score updates ✅
- Responsive design ✅

### Phase 4: Deployment
- Backend deployment
- Frontend deployment
- Production MongoDB configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues or questions:
- Check the documentation in the `/docs` folder
- Review [PROJECT_PLAN.md](PROJECT_PLAN.md)
- Open an issue on GitHub

---

**Built with ❤️ to help job seekers land their dream jobs**
