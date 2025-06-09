"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const queries_ts_1 = require("../../db/queries.ts");
const handler = async (event) => {
    console.log('[submit-score] Function invoked', { method: event.httpMethod, path: event.path, event });
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    try {
        console.log('[submit-score] Processing request...');
        const body = JSON.parse(event.body || '{}');
        const { ageGroup, gender, score, sessionId } = body;
        if (!ageGroup || !gender || typeof score !== 'number' || !sessionId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' }),
            };
        }
        await (0, queries_ts_1.saveScore)({
            ageGroup,
            gender,
            score,
            sessionId,
        });
        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: true }),
        };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('[submit-score] Error:', error.stack);
        }
        else {
            console.error('[submit-score] Error:', error);
        }
        console.error('Error submitting score:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to submit score' }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=index.js.map