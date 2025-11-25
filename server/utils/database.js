import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    // Connessione a MongoDB Cloud (MongoDB Atlas)
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI non è definita nel file .env. Configura la connection string del cluster MongoDB.');
    }
    
    const mongoURI = process.env.MONGODB_URI;
    
    await mongoose.connect(mongoURI, {
      // Opzioni consigliate per cluster MongoDB cloud
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
};

