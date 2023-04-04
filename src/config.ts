import { config } from 'dotenv';
config();
export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, MONGO_URI, MONGODB_URI, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, URL } = process.env;
