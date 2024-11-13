import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createClient } from 'redis-memory-server';
import { app } from '../../server';

let mongoServer: MongoMemoryServer;
let redisClient: any;

beforeAll(async () => {
  // Setup MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Setup Redis Memory Server
  redisClient = await createClient();
  await redisClient.connect();

  // Create test data
  await setupTestData();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await redisClient.quit();
});

async function setupTestData() {
  // Add any test data setup here
}