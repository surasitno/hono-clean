
import { Db, MongoClient } from 'mongodb';
import { Config } from '../../config';

let client: MongoClient;
let db: Db;

export const connectDB = async (): Promise<void> => {
  if (client) {
    return;
  }

  try {
    client = new MongoClient(Config.MONGO_URL);
    await client.connect();
    db = client.db(Config.DB_NAME);
    console.log(`MongoDB Connected: ${Config.DB_NAME}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export const getDB = (): Db => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

export const closeDB = async (): Promise<void> => {
  if (client) {
    await client.close();
  }
};
