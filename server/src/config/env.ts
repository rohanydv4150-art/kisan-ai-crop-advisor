import dotenv from 'dotenv';
import path from 'path';

// Load .env from workspace root or current dir
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // Gemini AI
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',

  // Weather
  WEATHER_PROVIDER: process.env.WEATHER_PROVIDER || 'open-meteo',
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || '',
  WEATHER_API_BASE_URL: process.env.WEATHER_API_BASE_URL || 'https://api.open-meteo.com/v1',

  // App settings
  DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE || 'en',
  DEFAULT_RECOMMENDATION_COUNT: parseInt(process.env.DEFAULT_RECOMMENDATION_COUNT || '5', 10),
  MAX_RECOMMENDATION_COUNT: parseInt(process.env.MAX_RECOMMENDATION_COUNT || '10', 10),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

export const isDev = ENV.NODE_ENV === 'development';
export const hasGeminiKey = Boolean(ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY !== 'your-google-gemini-api-key');
export const hasSupabaseConfig = Boolean(
  ENV.SUPABASE_URL && 
  ENV.SUPABASE_ANON_KEY && 
  ENV.SUPABASE_URL !== 'https://your-project.supabase.co'
);
