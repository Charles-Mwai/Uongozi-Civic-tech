import { Handler } from '@netlify/functions';
import { requireAuth } from '../../utils/auth';
import { getScoreStats, getScoreDistribution, getScoresByDate } from '../../db/queries';

const handler: Handler = async (event) => {
  console.log('[scores] Function invoked', { method: event.httpMethod, path: event.path, event });
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    console.log('[scores] Processing request...');
    const [stats, distribution, byDate] = await Promise.all([
      getScoreStats(),
      getScoreDistribution(),
      getScoresByDate(),
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
  } catch (error) {
    if (error instanceof Error) {
      console.error('[scores] Error:', error.stack);
    } else {
      console.error('[scores] Error:', error);
    }
    console.error('Error fetching scores:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch scores' }),
    };
  }
};

export { handler };
// Wrap the handler with requireAuth
export const protectedHandler = requireAuth(handler);
