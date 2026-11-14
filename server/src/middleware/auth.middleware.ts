import { Request, Response, NextFunction } from 'express';
import { getSupabaseAnon } from '../config/supabase.js';
import { AuthUser } from '../types/index.js';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Missing Bearer token.',
      code: 'UNAUTHORIZED',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const supabase = getSupabaseAnon();

  // If real Supabase is configured, verify through Supabase Auth
  if (supabase) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        res.status(401).json({
          success: false,
          message: 'Invalid or expired authentication token.',
          code: 'INVALID_TOKEN',
        });
        return;
      }

      req.user = {
        id: user.id,
        email: user.email || 'farmer@example.com',
      };
      return next();
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: 'Failed to verify authentication credentials.',
        code: 'AUTH_VERIFICATION_FAILED',
      });
      return;
    }
  }

  // Development / Demo mode token support (e.g. demo-farmer or custom uuid)
  if (token.startsWith('demo-') || token.includes('-')) {
    req.user = {
      id: token.startsWith('demo-') ? '00000000-0000-0000-0000-000000000001' : token,
      email: 'demo-farmer@kisanai.org',
    };
    return next();
  }

  // Basic mock token support
  req.user = {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'farmer@example.com',
  };
  return next();
}
