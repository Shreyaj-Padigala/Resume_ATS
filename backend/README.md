# Resume ATS - Backend API

Backend server for the Resume ATS application - an AI-powered resume analyzer with MongoDB Atlas integration.

## Features

- ✅ MongoDB Atlas database connection
- ✅ User authentication with JWT
- ✅ Weekly usage limit tracking (4 analyses per week)
- ✅ Resume analysis with version history
- ✅ AI-powered ATS scoring
- ✅ Secure password hashing with bcrypt
- ✅ RESTful API architecture

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **pdf-parse** - PDF processing
- **GroqCloud API** - AI analysis

## Prerequisites

- Node.js >= 18.0.0
- MongoDB Atlas account
- GroqCloud API key

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Update `.env` with your credentials:
```env
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-secret-key
GROQ_API_KEY=your-groq-api-key
PORT=5000
NODE_ENV=development
```

See [MONGODB_SETUP.md](../MONGODB_SETUP.md) for detailed MongoDB Atlas setup instructions.

### 3. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

### 4. Test the Connection

Visit `http://localhost:5000/health` to check if the server is running.

Visit `http://localhost:5000/api/test-db` to verify MongoDB connection.

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── models/
│   ├── User.js              # User schema with auth & usage tracking
│   └── Analysis.js          # Resume analysis schema
├── routes/                  # API routes (to be implemented)
├── controllers/             # Route controllers (to be implemented)
├── middleware/              # Custom middleware (to be implemented)
├── services/                # Business logic (to be implemented)
├── utils/                   # Helper functions (to be implemented)
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
└── server.js                # Application entry point
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests with Jest
- `npm run test:watch` - Run tests in watch mode

## Database Schema

### User Model

```javascript
{
  email: String (unique),
  password: String (hashed),
  weeklyUsage: {
    count: Number (0-4),
    weekStartDate: Date,
    lastResetDate: Date
  },
  analysisHistory: [ObjectId],
  createdAt: Date
}
```

**Methods:**
- `matchPassword(password)` - Compare password for login
- `canCreateAnalysis()` - Check if user can create new analysis
- `incrementUsage()` - Increment weekly usage count
- `getRemainingAnalyses()` - Get remaining analyses for the week

### Analysis Model

```javascript
{
  userId: ObjectId,
  jobTitle: String,
  jobDescription: String,
  resumeText: String,
  atsScore: Number (0-100),
  suggestions: [{
    category: String,
    priority: String,
    suggestion: String,
    implemented: Boolean
  }],
  versions: [{
    versionNumber: Number,
    resumeText: String,
    atsScore: Number,
    timestamp: Date
  }],
  status: String ('in-progress' | 'completed'),
  createdAt: Date,
  updatedAt: Date
}
```

**Methods:**
- `addVersion(resumeText, atsScore)` - Add new version
- `complete()` - Mark analysis as completed
- `getSummary()` - Get analysis summary
- `getHighPrioritySuggestions()` - Get unimplemented high priority suggestions

## API Endpoints (Planned)

### Authentication
```
POST   /api/auth/signup      - Register new user
POST   /api/auth/login       - Login user
POST   /api/auth/logout      - Logout user
GET    /api/auth/me          - Get current user
```

### Analysis
```
POST   /api/analysis/create  - Create new analysis
POST   /api/analysis/:id/update - Update analysis with improvements
GET    /api/analysis/:id     - Get specific analysis
DELETE /api/analysis/:id     - Delete analysis
```

### User
```
GET    /api/user/analyses    - Get user's analysis history
GET    /api/user/usage       - Get usage statistics
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | Random 256-bit string |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `GROQ_API_KEY` | GroqCloud API key | `gsk_...` |
| `GROQ_MODEL` | AI model to use | `mixtral-8x7b-32768` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MAX_FILE_SIZE` | Max upload size in bytes | `5242880` (5MB) |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## MongoDB Atlas Setup

Follow the detailed guide in [MONGODB_SETUP.md](../MONGODB_SETUP.md) to:
1. Create a MongoDB Atlas account
2. Set up a free cluster
3. Configure database access
4. Get your connection string
5. Test the connection

## Security Features

- **Password Hashing:** bcrypt with salt rounds
- **JWT Authentication:** Secure token-based auth
- **CORS:** Configured for specific origins
- **Helmet:** Security headers
- **Rate Limiting:** Prevent abuse
- **Input Validation:** Mongoose schema validation

## Error Handling

The application includes:
- Global error handler
- Custom error classes
- Validation error handling
- Database connection error handling
- Graceful shutdown on process termination

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Whitelist specific IPs in MongoDB Atlas
- [ ] Enable MongoDB Atlas encryption
- [ ] Set up HTTPS
- [ ] Configure proper CORS origins
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure automated backups

### Recommended Platforms
- **Backend:** Railway, Render, Fly.io, Heroku
- **Database:** MongoDB Atlas (already cloud-hosted)

## Troubleshooting

### MongoDB Connection Issues
```
Error: MongoServerError: bad auth
```
**Solution:** Check username/password in connection string

```
Error: MongooseServerSelectionError
```
**Solution:** Verify IP whitelist in MongoDB Atlas Network Access

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in `.env` or kill process using port 5000

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

MIT

---

**Need Help?** Check the [MongoDB Setup Guide](../MONGODB_SETUP.md) or [Project Plan](../PROJECT_PLAN.md)
