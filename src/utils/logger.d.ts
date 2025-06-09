// Type definitions for the logger module
declare const logger: {
    info: (message: string, data?: Record<string, unknown>) => void;
    error: (message: string, data?: Record<string, unknown>) => void;
    debug: (message: string, data?: Record<string, unknown>) => void;
    warn: (message: string, data?: Record<string, unknown>) => void;
    trace: (message: string, data?: Record<string, unknown>) => void;
};

export default logger;
