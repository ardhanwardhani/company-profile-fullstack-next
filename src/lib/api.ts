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

export type Handler<T = any> = (context: ApiContext, req: NextRequest) => Promise<NextResponse<ApiResponse<T>>>;

export function withAuth<T>(handler: Handler<T>): Handler<T> {
  return async (context, req) => {
    if (!context.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return handler(context, req);
  };
}

export function withRole<T>(allowedRoles: string[]): (handler: Handler<T>) => Handler<T> {
  return (handler) => async (context, req) => {
    if (!context.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!allowedRoles.includes(context.user.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    return handler(context, req);
  };
}

export function withMethods<T>(methods: string[]): (handler: Handler<T>) => Handler<T> {
  return (handler) => async (context, req) => {
    if (!methods.includes(req.method || '')) {
      return NextResponse.json({ success: false, error: `Method ${req.method} not allowed` }, { status: 405 });
    }
    return handler(context, req);
  };
}
