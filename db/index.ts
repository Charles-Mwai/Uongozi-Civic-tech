import { drizzle } from 'drizzle-orm/neon-http';
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import * as schema from './schema.js';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';

// Import logger with type assertion to handle ES module import
// @ts-ignore - We'll create the type declaration next
import logger from '../src/utils/logger.js';

// Type for the logger to avoid TypeScript errors
type Logger = {
    info: (message: string, data?: Record<string, unknown>) => void;
    error: (message: string, data?: Record<string, unknown>) => void;
    debug: (message: string, data?: Record<string, unknown>) => void;
    warn: (message: string, data?: Record<string, unknown>) => void;
};

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL'] as const;
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    const errorMsg = `Missing required environment variables: ${missingVars.join(', ')}`;
    (logger as Logger).error(errorMsg);
    throw new Error(errorMsg);
}

// Log database connection attempt
const dbUrl = process.env.DATABASE_URL as string;
const dbName = dbUrl ? new URL(dbUrl).pathname.replace(/^\/+/, '') : 'unknown';
const dbHost = dbUrl ? new URL(dbUrl).hostname : 'unknown';

(logger as Logger).info('Initializing database connection...', {
    database: dbName,
    host: dbHost
});

// Initialize the database connection
let db: PostgresJsDatabase<typeof schema>;

try {
    const sql: NeonQueryFunction<boolean, boolean> = neon(dbUrl);
    db = drizzle(sql, { 
        schema,
        logger: {
            logQuery: (query: string, params: unknown[]) => {
                (logger as Logger).debug('Database query', {
                    query,
                    params: params || []
                });
            }
        }
    });
    (logger as Logger).info('Database connection initialized successfully');
} catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : 'Error';
    const errorCode = (error as { code?: string }).code || 'UNKNOWN';
    const errorStack = error instanceof Error ? error.stack : '';
    
    (logger as Logger).error('Failed to initialize database connection', {
        error: {
            name: errorName,
            message: errorMessage,
            code: errorCode,
            stack: errorStack
        }
    });
    throw error; // Re-throw to prevent application from starting with a bad DB connection
}

// Test the connection on startup
async function testConnection() {
    try {
        // Get the raw client from the connection pool
        const client = await db.execute(sql`SELECT 1`);
        
        // If we get here, the connection is working
        (logger as Logger).info('Database connection test successful');
        return true;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorName = error instanceof Error ? error.name : 'Error';
        const errorCode = (error as { code?: string }).code || 'UNKNOWN';
        
        (logger as Logger).error('Database connection test failed', {
            error: {
                name: errorName,
                message: errorMessage,
                code: errorCode
            }
        });
        return false;
    }
}

// Run the connection test when this module is imported
testConnection().catch((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : 'Error';
    
    (logger as Logger).error('Error during database connection test', {
        error: {
            name: errorName,
            message: errorMessage
        }
    });
});

export { db };
export type * from './schema.js';