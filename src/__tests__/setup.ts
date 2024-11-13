import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Redis from 'ioredis-mock';
import { logger } from '../utils/logger';

let mongoServer: MongoMemoryServer;
let redisClient: Redis;

beforeAll(async () => {
  try {
    // Setup MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Setup Redis Mock
    redisClient = new Redis();

    logger.info('Test databases initialized');
  } catch (error) {
    logger.error('Failed to initialize test databases:', error);
    throw error;
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await redisClient.quit();
});