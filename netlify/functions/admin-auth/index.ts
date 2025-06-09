import { Handler } from '@netlify/functions';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
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
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Get the request body
    const { username, password } = JSON.parse(event.body || '{}');
    
    // Get environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Validate credentials
    if (username === adminUsername && password === adminPassword) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS
        },
        body: JSON.stringify({ success: true }),
      };
    } else {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS
        },
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }
  } catch (error) {
    console.error('Authentication error:', error);
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
