import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

export const requireAuth = (handler: Handler) => {
  return async (event: HandlerEvent, context: HandlerContext) => {
    const authHeader = event.headers.authorization || '';
    
    if (!authHeader.startsWith('Basic ')) {
      return {
        statusCode: 401,
        headers: { 'WWW-Authenticate': 'Basic' },
        body: 'Unauthorized',
      };
    }

    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return {
        statusCode: 403,
        body: 'Forbidden',
      };
    }

    return handler(event, context);
  };
};
