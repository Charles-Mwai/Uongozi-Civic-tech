"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const serverless_1 = require("@neondatabase/serverless");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const neon_http_1 = require("drizzle-orm/neon-http");
const drizzle_orm_1 = require("drizzle-orm");
const handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }
    // Verify the request has a valid authorization header
    const authHeader = event.headers.authorization || '';
    const expectedToken = process.env.MIGRATION_TOKEN || 'default-secret-token';
    if (!authHeader.startsWith('Bearer ') ||
        authHeader.split(' ')[1] !== expectedToken) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Unauthorized' }),
        };
    }
    try {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error('DATABASE_URL environment variable is not set');
        }
        // Initialize database client with type assertion
        const client = (0, serverless_1.neon)(dbUrl); // Type assertion to bypass type checking
        const db = (0, neon_http_1.drizzle)(client);
        // Helper function to execute raw SQL queries
        const executeQuery = async (query, params = []) => {
            return client.query(query, params);
        };
        const migrationsDir = path_1.default.join(process.cwd(), 'migrations');
        // Get all migration files
        const allFiles = await fs_1.promises.readdir(migrationsDir);
        const files = allFiles
            .filter((file) => file.endsWith('.sql') && /^\d+_.+\.sql$/.test(file))
            .sort();
        if (files.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'No migration files found' }),
            };
        }
        // Ensure migrations table exists
        await (0, drizzle_orm_1.sql) `
      CREATE TABLE IF NOT EXISTS public._migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        success BOOLEAN NOT NULL DEFAULT true
      );
    `;
        // Get applied migrations using raw SQL
        const appliedMigrations = await executeQuery('SELECT name FROM public._migrations WHERE success = true');
        const appliedMigrationNames = new Set(appliedMigrations.rows.map((row) => row.name));
        const appliedMigrationsList = [];
        // Apply each migration
        for (const file of files) {
            if (appliedMigrationNames.has(file)) {
                console.log(`Skipping already applied migration: ${file}`);
                continue;
            }
            const filePath = path_1.default.join(migrationsDir, file);
            const sqlContent = await fs_1.promises.readFile(filePath, 'utf8');
            try {
                // Start transaction
                await executeQuery('BEGIN');
                try {
                    // Execute the migration
                    await executeQuery(sqlContent);
                    // Record the migration
                    await executeQuery(`INSERT INTO public._migrations (name, success, executed_at)
             VALUES ($1, true, NOW())
             ON CONFLICT (name) 
             DO UPDATE SET success = true, executed_at = NOW()`, [file]);
                    // Commit transaction
                    await executeQuery('COMMIT');
                    appliedMigrationsList.push(file);
                    console.log(`✅ Applied migration: ${file}`);
                }
                catch (txError) {
                    // Rollback transaction on error
                    await executeQuery('ROLLBACK');
                    console.error(`❌ Transaction error in migration ${file}:`, txError);
                    // Record the failure
                    await (0, drizzle_orm_1.sql) `
            INSERT INTO public._migrations (name, success, executed_at)
            VALUES (${file}, false, NOW())
            ON CONFLICT (name) 
            DO UPDATE SET success = false, executed_at = NOW();
          `;
                    throw txError;
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(`❌ Error applying migration ${file}:`, errorMessage);
                throw error;
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Migrations completed successfully',
                appliedMigrations: appliedMigrationsList,
            }),
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Error running migrations:', errorMessage);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: 'Failed to run migrations',
                error: errorMessage,
                appliedMigrations: []
            })
        };
    }
};
exports.handler = handler;
// For local testing
if (process.env.NETLIFY_DEV) {
    const runLocalMigrations = async () => {
        try {
            const { config } = await Promise.resolve().then(() => __importStar(require('dotenv')));
            config({ path: '.env.local' });
            const event = {
                httpMethod: 'POST',
                headers: {
                    authorization: `Bearer ${process.env.MIGRATION_TOKEN || 'default-secret-token'}`
                }
            };
            const result = await (0, exports.handler)(event, {});
            console.log('Migration result:', result);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Migration error:', errorMessage);
        }
    };
    // Run migrations when this file is executed directly
    if (require.main === module) {
        runLocalMigrations();
    }
}
//# sourceMappingURL=run-migrations.js.map