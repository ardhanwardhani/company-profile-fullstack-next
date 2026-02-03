import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken, TokenPayload } from './auth';

export interface ApiContext {
  user: TokenPayload | null;
}

export function createContext(req: NextApiRequest): ApiContext {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null };
  }
  
  const token = authHeader.substring(7);
  const user = verifyToken(token);
  
  return { user };
}

export type Handler<T = any> = (context: ApiContext, req: NextApiRequest, res: NextApiResponse<T>) => Promise<void>;

export function withAuth<T>(handler: Handler<T>): Handler<T> {
  return async (context, req, res) => {
    if (!context.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return handler(context, req, res);
  };
}

export function withRole<T>(allowedRoles: string[]): (handler: Handler<T>) => Handler<T> {
  return (handler) => async (context, req, res) => {
    if (!context.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!allowedRoles.includes(context.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    return handler(context, req, res);
  };
}

export function withMethods<T>(methods: string[]): (handler: Handler<T>) => Handler<T> {
  return (handler) => async (context, req, res) => {
    if (!methods.includes(req.method || '')) {
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
    return handler(context, req, res);
  };
}
