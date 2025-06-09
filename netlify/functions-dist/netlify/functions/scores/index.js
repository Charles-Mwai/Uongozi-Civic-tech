"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedHandler = exports.handler = void 0;
const auth_1 = require("../../utils/auth");
const queries_1 = require("../../db/queries");
const handler = async (event) => {
    console.log('[scores] Function invoked', { method: event.httpMethod, path: event.path, event });
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    try {
        console.log('[scores] Processing request...');
        const [stats, distribution, byDate] = await Promise.all([
            (0, queries_1.getScoreStats)(),
            (0, queries_1.getScoreDistribution)(),
            (0, queries_1.getScoresByDate)(),
        ]);
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                stats,
                distribution,
                byDate,
            }),
        };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('[scores] Error:', error.stack);
        }
        else {
            console.error('[scores] Error:', error);
        }
        console.error('Error fetching scores:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch scores' }),
        };
    }
};
exports.handler = handler;
// Wrap the handler with requireAuth
exports.protectedHandler = (0, auth_1.requireAuth)(handler);
//# sourceMappingURL=index.js.map