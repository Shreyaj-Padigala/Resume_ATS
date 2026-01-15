# Resume ATS - Complete Startup Guide

This guide will walk you through setting up and running the Resume ATS application from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [MongoDB Atlas Configuration](#mongodb-atlas-configuration)
4. [GroqCloud API Setup](#groqcloud-api-setup)
5. [Environment Configuration](#environment-configuration)
6. [Starting the Application](#starting-the-application)
7. [Testing Your Setup](#testing-your-setup)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed and ready:

### Required Software
- **Node.js** (version 18.0.0 or higher)
  - Check version: `node --version`
  - Download from: https://nodejs.org/
- **npm** (comes with Node.js)
  - Check version: `npm --version`
- **Git** (for cloning the repository)
  - Check version: `git --version`

### Required Accounts
- **MongoDB Atlas Account** (free tier available)
  - Sign up at: https://www.mongodb.com/cloud/atlas/register
- **GroqCloud Account** (for AI analysis)
  - Sign up at: https://console.groq.com

---

## Initial Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd Resume_ATS
```

### Step 2: Install Backend Dependencies

```bash
# Navigate to the backend directory
cd backend

# Install all required packages
npm install
```

This will install all dependencies listed in `package.json`, including:
- Express.js (web framework)
- Mongoose (MongoDB ODM)
- JWT authentication packages
- PDF parsing libraries
- And more...

**Wait for installation to complete** - this may take a few minutes.

---

## MongoDB Atlas Configuration

### Step 1: Create a MongoDB Atlas Cluster

1. **Log in to MongoDB Atlas**
   - Go to https://cloud.mongodb.com/
   - Sign in with your account

2. **Create a New Cluster** (if you don't have one)
   - Click "Build a Cluster"
   - Select the **FREE** tier (M0 Sandbox)
   - Choose a cloud provider and region closest to you
   - Name your cluster (e.g., "resume-ats-cluster")
   - Click "Create Cluster"
   - Wait 3-5 minutes for the cluster to be created

### Step 2: Configure Database Access

1. **Create a Database User**
   - In the left sidebar, click "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter a username (e.g., "resumeAtsUser")
   - Click "Autogenerate Secure Password" and **SAVE THIS PASSWORD**
   - Set privileges to "Atlas Admin" (or "Read and write to any database")
   - Click "Add User"

### Step 3: Configure Network Access

1. **Add Your IP Address**
   - In the left sidebar, click "Network Access"
   - Click "Add IP Address"
   - For development, click "Allow Access from Anywhere" (0.0.0.0/0)
     - **Note:** For production, restrict to specific IPs
   - Click "Confirm"

### Step 4: Get Your Connection String

1. **Get the Connection String**
   - Go back to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select "Node.js" as the driver
   - Copy the connection string (looks like this):
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - **Save this connection string** - you'll need it in the next section

2. **Modify the Connection String**
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add the database name after `.net/`: `/resume-ats`
   - Final format:
     ```
     mongodb+srv://resumeAtsUser:yourPassword123@cluster0.xxxxx.mongodb.net/resume-ats?retryWrites=true&w=majority
     ```

For more detailed MongoDB setup instructions, see [MONGODB_SETUP.md](MONGODB_SETUP.md).

---

## GroqCloud API Setup

### Step 1: Create a GroqCloud Account

1. **Sign Up**
   - Go to https://console.groq.com
   - Create an account or sign in

2. **Generate an API Key**
   - Navigate to the API Keys section
   - Click "Create API Key"
   - Give it a name (e.g., "Resume ATS Development")
   - Copy the API key immediately
   - **Save this key securely** - you won't be able to see it again

---

## Environment Configuration

### Step 1: Create Environment File

```bash
# Make sure you're in the backend directory
cd backend

# Copy the example environment file
cp .env.example .env
```

### Step 2: Edit the .env File

Open the `.env` file in your text editor and fill in the following values:

```env
# MongoDB Atlas Configuration
# Paste your MongoDB connection string here
MONGODB_URI=mongodb+srv://resumeAtsUser:yourPassword123@cluster0.xxxxx.mongodb.net/resume-ats?retryWrites=true&w=majority

# JWT Configuration
# Generate a secure secret key (see below for how to generate)
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# GroqCloud API Configuration
# Paste your GroqCloud API key here
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GROQ_MODEL=mixtral-8x7b-32768

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=5242880

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Session Configuration
SESSION_TIMEOUT=3600000
```

### Step 3: Generate a Secure JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET` value in the `.env` file.

### Step 4: Verify Your Configuration

Double-check that you've filled in:
- ✅ MONGODB_URI (with your actual username, password, and cluster URL)
- ✅ JWT_SECRET (generated secure random string)
- ✅ GROQ_API_KEY (from GroqCloud console)

---

## Starting the Application

### Step 1: Start the Development Server

```bash
# Make sure you're in the backend directory
cd backend

# Start the server in development mode (with auto-reload)
npm run dev
```

You should see output similar to:
```
Server running in development mode on port 5000
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

### Alternative: Start in Production Mode

```bash
# Start without auto-reload
npm start
```

### What's Happening?

- The server starts on `http://localhost:5000`
- It connects to your MongoDB Atlas database
- All API endpoints become available
- Nodemon watches for file changes and auto-restarts (in dev mode)

---

## Testing Your Setup

### Test 1: Check Server Health

Open your browser or use curl:

```bash
# Browser: Navigate to
http://localhost:5000/health

# Or use curl
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T10:30:00.000Z"
}
```

### Test 2: Check Database Connection

```bash
# Browser: Navigate to
http://localhost:5000/api/test-db

# Or use curl
curl http://localhost:5000/api/test-db
```

**Expected Response:**
```json
{
  "message": "Database connection successful",
  "database": "resume-ats"
}
```

### Test 3: Verify API Endpoints

Test that the API is responding:

```bash
curl http://localhost:5000/api/health
```

### If All Tests Pass

✅ Your Resume ATS backend is now running successfully!

You can now:
- Access the API at `http://localhost:5000`
- Start developing or testing features
- Use the API endpoints (once implemented)

---

## Troubleshooting

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "MongoDB connection failed"

**Possible Causes:**
1. Wrong connection string in `.env`
2. Database user not created
3. IP address not whitelisted

**Solutions:**
- Verify your `MONGODB_URI` in `.env` matches your Atlas connection string
- Check that you replaced `<username>` and `<password>` with actual values
- Ensure your IP is whitelisted in MongoDB Atlas Network Access
- Verify the database user exists in Database Access section

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Find and kill the process using port 5000
# On macOS/Linux:
lsof -ti:5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change the port in .env file:
PORT=5001
```

### Issue: "Cannot find module 'dotenv'"

**Solution:**
```bash
# Install dependencies again
npm install
```

### Issue: "JWT_SECRET is not defined"

**Solution:**
- Check that your `.env` file exists in the backend directory
- Verify `JWT_SECRET` is set in `.env`
- Restart the server after modifying `.env`

### Issue: "GroqCloud API error"

**Possible Causes:**
1. Invalid API key
2. API key not set in `.env`
3. Rate limit exceeded

**Solutions:**
- Verify `GROQ_API_KEY` in `.env` is correct
- Generate a new API key from GroqCloud console
- Check GroqCloud console for usage limits

### Issue: Server starts but crashes immediately

**Solution:**
```bash
# Check the error logs
# Usually indicates missing environment variables or database connection issues

# Verify all required variables are set in .env:
cat .env | grep -v "^#" | grep -v "^$"
```

### Getting Help

If you're still experiencing issues:

1. **Check the logs** - The console output usually provides helpful error messages
2. **Review the documentation**:
   - [PROJECT_PLAN.md](PROJECT_PLAN.md) - Project overview
   - [MONGODB_SETUP.md](MONGODB_SETUP.md) - Detailed database setup
   - [backend/README.md](backend/README.md) - Backend documentation
3. **Common commands**:
   ```bash
   # Check Node.js version
   node --version

   # Check if .env file exists
   ls -la backend/.env

   # Test MongoDB connection string format
   echo $MONGODB_URI
   ```

---

## Next Steps

Once your server is running successfully:

1. **Explore the API endpoints** (once implemented)
2. **Review the project plan**: [PROJECT_PLAN.md](PROJECT_PLAN.md)
3. **Set up the frontend** (coming soon)
4. **Start developing features**

---

## Quick Reference

### Start Development Server
```bash
cd backend
npm run dev
```

### Stop the Server
Press `Ctrl + C` in the terminal

### Restart the Server
In dev mode with nodemon, just save any file to auto-restart.

Or manually:
```bash
# Stop with Ctrl + C, then:
npm run dev
```

### Check Server Status
```bash
curl http://localhost:5000/health
```

### View Logs
Logs appear in the terminal where you ran `npm run dev`

---

## Important URLs

- **Backend Server**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **API Base**: http://localhost:5000/api
- **MongoDB Atlas Dashboard**: https://cloud.mongodb.com
- **GroqCloud Console**: https://console.groq.com

---

**You're all set! Happy coding! 🚀**

For questions or issues, refer to the troubleshooting section or check the project documentation.
