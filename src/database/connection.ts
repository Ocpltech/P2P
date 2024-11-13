import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import logger from '../utils/logger';

const connectWithRetry = async (): Promise<typeof mongoose> => {
  try {
    // Use MongoDB Memory Server for development/testing
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const connection = await mongoose.connect(mongoUri, {
      autoCreate: true,
      autoIndex: true,
    });

    logger.info('Connected to MongoDB Memory Server');
    return connection;
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
};

export default connectWithRetry;
