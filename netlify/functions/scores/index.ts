import { Handler } from '@netlify/functions';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// Mock data for demonstration
const mockStats = [
  { ageGroup: '18-24', gender: 'male', average: '75', count: 10 },
  { ageGroup: '25-34', gender: 'female', average: '82', count: 15 },
  { ageGroup: '35-44', gender: 'male', average: '68', count: 8 },
  { ageGroup: '45-54', gender: 'female', average: '90', count: 12 },
  { ageGroup: '55+', gender: 'male', average: '78', count: 5 }
];

const mockDistribution = [
  { score: '0-20', count: 2 },
  { score: '21-40', count: 5 },
  { score: '41-60', count: 8 },
  { score: '61-80', count: 15 },
  { score: '81-100', count: 20 }
];

const mockByDate = [
  { date: '2023-01-01', count: 5 },
  { date: '2023-01-02', count: 8 },
  { date: '2023-01-03', count: 12 },
  { date: '2023-01-04', count: 15 },
  { date: '2023-01-05', count: 10 }
];

export const handler: Handler = async (event) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // In a real app, you would fetch this data from your database
    // For now, we'll return mock data
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        stats: mockStats,
        distribution: mockDistribution,
        byDate: mockByDate
      })
    };
  } catch (error) {
    console.error('Error in scores function:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
