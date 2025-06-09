import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Get the current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}
const logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);
// Ensure log file exists
if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '');
}
// Log levels
const LOG_LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG',
    TRACE: 'TRACE'
};
// Current log level (change this to control log verbosity)
const CURRENT_LOG_LEVEL = process.env.LOG_LEVEL || LOG_LEVELS.INFO;
/**
 * Log a message with the specified level
 * @param {string} level - Log level
 * @param {string} message - Message to log
 * @param {Object} [data] - Additional data to log
 */
function log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        message,
        ...(Object.keys(data).length > 0 && { data })
    };
    // Only log if the message level is at or above the current log level
    const levelPriority = Object.values(LOG_LEVELS).indexOf(level);
    const currentPriority = Object.values(LOG_LEVELS).indexOf(CURRENT_LOG_LEVEL);
    if (levelPriority <= currentPriority) {
        // Log to console with colors
        const colors = {
            [LOG_LEVELS.ERROR]: '\x1b[31m', // Red
            [LOG_LEVELS.WARN]: '\x1b[33m', // Yellow
            [LOG_LEVELS.INFO]: '\x1b[36m', // Cyan
            [LOG_LEVELS.DEBUG]: '\x1b[35m', // Magenta
            [LOG_LEVELS.TRACE]: '\x1b[90m' // Gray
        };
        const resetColor = '\x1b[0m';
        const consoleMessage = `${colors[level] || ''}[${timestamp}] [${level}] ${message}${resetColor}`;
        console.log(consoleMessage);
        // Log to file
        fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    }
}
// Create logger methods for each log level
const logger = {
    error: (message, data) => log(LOG_LEVELS.ERROR, message, data),
    warn: (message, data) => log(LOG_LEVELS.WARN, message, data),
    info: (message, data) => log(LOG_LEVELS.INFO, message, data),
    debug: (message, data) => log(LOG_LEVELS.DEBUG, message, data),
    trace: (message, data) => log(LOG_LEVELS.TRACE, message, data)
};
export default logger;
//# sourceMappingURL=logger.js.map