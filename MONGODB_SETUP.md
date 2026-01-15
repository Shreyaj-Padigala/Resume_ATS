# MongoDB Atlas Setup Guide

This guide will walk you through setting up MongoDB Atlas for your Resume ATS application.

---

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account using:
   - Google account
   - GitHub account
   - Email and password

---

## Step 2: Create a New Cluster

### Option 1: Quick Setup (Recommended for Development)

1. After logging in, click **"Build a Database"** or **"Create"**
2. Choose **"M0 FREE"** tier (perfect for development)
   - 512 MB storage
   - Shared RAM
   - No credit card required
3. Select your preferred cloud provider:
   - **AWS** (recommended for most regions)
   - Google Cloud
   - Azure
4. Choose the region **closest to your users** for better performance
   - Example: `us-east-1` (Virginia) for East Coast US
   - Example: `us-west-2` (Oregon) for West Coast US
5. Name your cluster: `resume-ats-cluster`
6. Click **"Create"**

### Wait Time
⏱️ Cluster creation takes 3-5 minutes. You'll see a progress indicator.

---

## Step 3: Configure Database Access (Create User)

1. In the left sidebar, click **"Database Access"** under Security
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Set up your credentials:
   ```
   Username: resumeatsadmin
   Password: [Generate a secure password - click "Autogenerate Secure Password"]
   ```
   **⚠️ IMPORTANT:** Copy and save this password securely!

5. Database User Privileges:
   - Select **"Built-in Role"**
   - Choose **"Atlas admin"** (for development)
   - For production, use **"Read and write to any database"**

6. Click **"Add User"**

---

## Step 4: Configure Network Access

### Option 1: Allow Access from Anywhere (Development)
⚠️ Use this for development only!

1. In the left sidebar, click **"Network Access"** under Security
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` to the IP Access List
4. Add a comment: `Development - Allow all`
5. Click **"Confirm"**

### Option 2: Add Specific IP (Production Recommended)
🔒 More secure for production

1. Click **"Add IP Address"**
2. Click **"Add Current IP Address"** (automatically detects your IP)
3. Or manually enter your server's IP address
4. Add a description: `Production Server` or `My Development Machine`
5. Click **"Confirm"**

---

## Step 5: Get Your Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select your driver:
   - Driver: **Node.js**
   - Version: **4.1 or later**
5. Copy the connection string:
   ```
   mongodb+srv://resumeatsadmin:<password>@resume-ats-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Replace placeholders:**
   - Replace `<password>` with your actual database user password
   - Add database name: `/resume-ats` before the `?`

   **Final format:**
   ```
   mongodb+srv://resumeatsadmin:YOUR_ACTUAL_PASSWORD@resume-ats-cluster.xxxxx.mongodb.net/resume-ats?retryWrites=true&w=majority
   ```

---

## Step 6: Configure Your Application

### Create .env File

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` and update with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://resumeatsadmin:YOUR_ACTUAL_PASSWORD@resume-ats-cluster.xxxxx.mongodb.net/resume-ats?retryWrites=true&w=majority

   JWT_SECRET=your-super-secret-jwt-key-change-this
   GROQ_API_KEY=your-groq-api-key-here
   PORT=5000
   NODE_ENV=development
   ```

### Generate JWT Secret

Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET` value.

---

## Step 7: Install Dependencies and Test Connection

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Start the Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: resume-ats-cluster-shard-00-00.xxxxx.mongodb.net
📊 Database Name: resume-ats
🚀 Server running in development mode on port 5000
```

### Test Database Connection

Open your browser or use curl:
```bash
curl http://localhost:5000/api/test-db
```

You should see:
```json
{
  "status": "success",
  "database": {
    "status": "connected",
    "name": "resume-ats",
    "host": "resume-ats-cluster-shard-00-00.xxxxx.mongodb.net"
  }
}
```

---

## Step 8: Verify in MongoDB Atlas Dashboard

1. Go to your cluster in MongoDB Atlas
2. Click **"Browse Collections"**
3. You should see your database: **`resume-ats`**
4. Initially, no collections will appear (they're created when you add data)

Once you create users and analyses, you'll see:
- `users` collection
- `analyses` collection

---

## Common Issues and Solutions

### Issue 1: "MongoServerError: bad auth"
**Solution:**
- Double-check your username and password in the connection string
- Make sure you replaced `<password>` with your actual password
- Ensure no special characters are URL-encoded (%, @, etc.)

### Issue 2: "MongooseServerSelectionError: connection timed out"
**Solutions:**
- Verify your IP address is whitelisted in Network Access
- Check if your network/firewall blocks MongoDB ports (27017)
- Try adding `0.0.0.0/0` to Network Access (development only)

### Issue 3: "ENOTFOUND" or DNS errors
**Solution:**
- Check your internet connection
- Verify the cluster name in your connection string
- Wait a few minutes if cluster was just created

### Issue 4: Cannot find module 'mongoose'
**Solution:**
```bash
cd backend
npm install mongoose
```

---

## Database Collections Schema

### Users Collection
Stores user authentication and usage tracking:
- Email, hashed password
- Weekly usage count (max 4)
- Week start date and reset tracking
- Analysis history references

### Analyses Collection
Stores resume analysis data:
- User reference
- Resume text and job description
- ATS score (0-100)
- AI-generated suggestions
- Version history (for iterative improvements)
- Status (in-progress, completed)

---

## Security Best Practices

### Development
✅ Use `0.0.0.0/0` for IP whitelist
✅ Use simple passwords for testing
✅ Keep `.env` in `.gitignore`

### Production
🔒 Whitelist only specific IP addresses
🔒 Use strong, randomly generated passwords
🔒 Enable MongoDB Atlas encryption at rest
🔒 Enable audit logs
🔒 Use environment variables (never hardcode)
🔒 Regularly rotate database passwords
🔒 Enable 2FA on MongoDB Atlas account

---

## Monitoring Your Database

### View Metrics
1. Go to your cluster dashboard
2. Click **"Metrics"** tab
3. Monitor:
   - Connections
   - Operations per second
   - Network usage
   - Storage size

### Set Up Alerts
1. Click **"Alerts"** in left sidebar
2. Set up alerts for:
   - High connection count
   - Storage usage > 80%
   - Query performance issues

---

## Free Tier Limits (M0)

- **Storage:** 512 MB
- **RAM:** Shared
- **Connections:** 500 concurrent
- **Backups:** Not included (manual exports only)

**When to upgrade:**
- Storage exceeds 500 MB
- Need more than 500 connections
- Need automated backups
- Need dedicated RAM/CPU

---

## Next Steps

Now that MongoDB Atlas is set up:

1. ✅ Test the connection (http://localhost:5000/api/test-db)
2. 📝 Implement authentication routes (`/api/auth`)
3. 📄 Implement analysis routes (`/api/analysis`)
4. 🎨 Build the frontend
5. 🚀 Deploy to production

---

## Helpful Resources

- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University (Free Courses)](https://university.mongodb.com/)
- [Connection String Format](https://www.mongodb.com/docs/manual/reference/connection-string/)

---

## Support

If you encounter issues:
1. Check the [MongoDB Atlas Status Page](https://status.mongodb.com/)
2. Review [MongoDB Community Forums](https://www.mongodb.com/community/forums/)
3. Check application logs in `backend/server.js`

---

**Setup Complete! 🎉**

Your MongoDB Atlas database is now ready for your Resume ATS application.
