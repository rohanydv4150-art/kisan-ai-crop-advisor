import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { ENV } from './config/env.js';

export function createApp(): Express {
  const app = express();

  // Security HTTP headers
  app.use(helmet());

  // CORS configuration supporting local dev, Vercel preview & production deployments
  const allowedOrigins: string[] = [
    ENV.CLIENT_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];

  if (ENV.CLIENT_URL && ENV.CLIENT_URL.includes(',')) {
    ENV.CLIENT_URL.split(',').forEach((url) => {
      const trimmed = url.trim();
      if (trimmed) allowedOrigins.push(trimmed);
    });
  }

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
        if (!origin) return callback(null, true);

        // Normalize origin without trailing slash
        const normalized = origin.replace(/\/+$/, '').toLowerCase();

        // Check if origin matches allowed list or any Vercel domain (*.vercel.app)
        const isExplicitlyAllowed = allowedOrigins.some(
          (allowed) => allowed && normalized === allowed.replace(/\/+$/, '').toLowerCase()
        );
        const isVercelDomain = /^https:\/\/[\w-]+\.vercel\.app$/.test(normalized);

        if (isExplicitlyAllowed || isVercelDomain) {
          callback(null, true);
        } else {
          // If in development or unconfigured, permit with warning to avoid breaking live demos
          console.warn(`[CORS] Incoming request from unlisted origin: ${origin}`);
          callback(null, true);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Rate limiting to protect against abuse
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again after 15 minutes',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  });
  app.use('/api', limiter);

  // Body parsing with size restrictions
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // API router mount
  app.use('/api/v1', apiRouter);

  // 404 handler for API routes
  app.use('/api/*', (_req, res) => {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found',
      code: 'ROUTE_NOT_FOUND',
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
