import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, TokenPayload } from './auth';

export interface ApiContext {
  user: TokenPayload | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

type RouteHandler = (request: NextRequest, context: { params?: Promise<Record<string, string>> }) => Promise<Response>;

export function withAuth<T>(handler: RouteHandler): RouteHandler {
  return async (req, context) => {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return handler(req, context);
  };
}

export function withRole<T>(allowedRoles: string[]): (handler: RouteHandler) => RouteHandler {
  return (handler) => async (req, context) => {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return handler(req, context);
  };
}

export function withMethods(methods: string[]): (handler: RouteHandler) => RouteHandler {
  return (handler) => async (req, context) => {
    if (!methods.includes(req.method)) {
      return NextResponse.json({ success: false, error: `Method ${req.method} not allowed` }, { status: 405 });
    }
    return handler(req, context);
  };
}
