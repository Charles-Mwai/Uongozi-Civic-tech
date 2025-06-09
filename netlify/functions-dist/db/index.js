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
exports.db = void 0;
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const schema = __importStar(require("./schema.js"));
const drizzle_orm_1 = require("drizzle-orm");
// Import logger with type assertion to handle ES module import
// @ts-ignore - We'll create the type declaration next
const logger_js_1 = __importDefault(require("../src/utils/logger.js"));
// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    const errorMsg = `Missing required environment variables: ${missingVars.join(', ')}`;
    logger_js_1.default.error(errorMsg);
    throw new Error(errorMsg);
}
// Log database connection attempt
const dbUrl = process.env.DATABASE_URL;
const dbName = dbUrl ? new URL(dbUrl).pathname.replace(/^\/+/, '') : 'unknown';
const dbHost = dbUrl ? new URL(dbUrl).hostname : 'unknown';
logger_js_1.default.info('Initializing database connection...', {
    database: dbName,
    host: dbHost
});
// Initialize the database connection
let db;
try {
    const sql = (0, serverless_1.neon)(dbUrl);
    exports.db = db = (0, neon_http_1.drizzle)(sql, {
        schema,
        logger: {
            logQuery: (query, params) => {
                logger_js_1.default.debug('Database query', {
                    query,
                    params: params || []
                });
            }
        }
    });
    logger_js_1.default.info('Database connection initialized successfully');
}
catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : 'Error';
    const errorCode = error.code || 'UNKNOWN';
    const errorStack = error instanceof Error ? error.stack : '';
    logger_js_1.default.error('Failed to initialize database connection', {
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
        const client = await db.execute((0, drizzle_orm_1.sql) `SELECT 1`);
        // If we get here, the connection is working
        logger_js_1.default.info('Database connection test successful');
        return true;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorName = error instanceof Error ? error.name : 'Error';
        const errorCode = error.code || 'UNKNOWN';
        logger_js_1.default.error('Database connection test failed', {
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
testConnection().catch((error) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : 'Error';
    logger_js_1.default.error('Error during database connection test', {
        error: {
            name: errorName,
            message: errorMessage
        }
    });
});
//# sourceMappingURL=index.js.map