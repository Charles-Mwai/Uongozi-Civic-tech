import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Configuration for Drizzle Kit
export default {
  schema: './db/schema.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    // In Netlify, we'll use the NETLIFY_DATABASE_URL environment variable
    connectionString: process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL || '',
  },
  // Only include our application tables, exclude system tables
  tablesFilter: ['!__drizzle*', '!*\_\_*', '!*\_migrations*'],
  verbose: true,
  strict: true,
} satisfies Config;