export const Config = {
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017',
  DB_NAME: process.env.DB_NAME || 'hono-clean-arch',
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
};
