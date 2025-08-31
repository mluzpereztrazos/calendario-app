const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    if (!MONGODB_URL) {
      throw new Error('MONGODB_URL no está definida en .env');
    }
    await mongoose.connect(MONGODB_URL);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Detiene la app si no puede conectar
  }
};

module.exports = connectDB;