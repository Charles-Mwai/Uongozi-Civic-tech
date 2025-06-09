import { Handler } from '@netlify/functions';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
};

export const handler: Handler = async (event) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // In a production app, you'd want to validate a session token or JWT here
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      },
      body: JSON.stringify({ 
        authenticated: true,
        timestamp: new Date().toISOString()
      }),
    };
  } catch (error) {
    console.error('Auth check error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
