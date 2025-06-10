import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';
import { parse } from 'pg-connection-string';

// Load environment variables
config({ path: '.env.local' });

// Parse the database URL
const dbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL || '';
const dbConfig = parse(dbUrl);

// Configuration for Drizzle Kit
export default {
  schema: './db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: dbConfig.host || '',
    port: dbConfig.port ? parseInt(dbConfig.port) : 5432,
    user: dbConfig.user || '',
    password: dbConfig.password || '',
    database: dbConfig.database || '',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  // Only include our application tables, exclude system tables
  tablesFilter: ['!__drizzle*', '!*\\_\\_*', '!*\\_migrations*'],
  verbose: true,
  strict: true,
} satisfies Config;