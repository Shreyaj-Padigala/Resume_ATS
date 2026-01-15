const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas database
 * Handles connection with retry logic and proper error handling
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 6+ no longer needs these options, but keeping for compatibility
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connected to MongoDB Atlas');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB Atlas');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 Mongoose connection closed due to app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);

    // Retry connection after 5 seconds
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

/**
 * Check if MongoDB connection is active
 */
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Close MongoDB connection
 */
const closeConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed successfully');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
  }
};

module.exports = {
  connectDB,
  isConnected,
  closeConnection
};
