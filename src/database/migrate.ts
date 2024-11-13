import mongoose from 'mongoose';
import { config } from '../config';
import { logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';
import connectWithRetry from './connection';

async function migrate() {
  let connection: typeof mongoose | undefined;
  
  try {
    connection = await connectWithRetry();
    logger.info('Connected to MongoDB');

    const migrationsPath = path.join(__dirname, 'migrations');
    
    // Create migrations directory if it doesn't exist
    await fs.mkdir(migrationsPath, { recursive: true });

    const files = await fs.readdir(migrationsPath);
    const migrationFiles = files
      .filter(f => f.endsWith('.ts') || f.endsWith('.js'))
      .sort();

    for (const file of migrationFiles) {
      try {
        const Migration = require(path.join(migrationsPath, file)).default;
        const migration = new Migration();

        logger.info(`Running migration: ${file}`);
        await migration.up();
        logger.info(`Completed migration: ${file}`);
      } catch (error) {
        logger.error(`Migration ${file} failed:`, error);
        throw error;
      }
    }

    logger.info('All migrations completed successfully');
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrate().catch(error => {
    logger.error('Unhandled migration error:', error);
    process.exit(1);
  });
}

export default migrate;