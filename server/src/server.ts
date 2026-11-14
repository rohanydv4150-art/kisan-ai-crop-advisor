import { createApp } from './app.js';
import { ENV, hasGeminiKey, hasSupabaseConfig } from './config/env.js';

const app = createApp();

const server = app.listen(ENV.PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🌾 AI-Powered Agriculture Crop Advisory Assistant API`);
  console.log(`=======================================================`);
  console.log(`🚀 Server listening on 0.0.0.0:${ENV.PORT} [${ENV.NODE_ENV}]`);
  console.log(`🌐 Base URL: http://localhost:${ENV.PORT}/api/v1`);
  console.log(`🔑 Gemini AI: ${hasGeminiKey ? 'Configured ✅ (' + ENV.GEMINI_MODEL + ')' : 'Pending API Key ⚠️'}`);
  console.log(`🗄️ Supabase: ${hasSupabaseConfig ? 'Connected ✅' : 'Running in Local Dev Mode ⚠️'}`);
  console.log(`🌦️ Weather: Open-Meteo & WMO Meteorological Integration Active ✅`);
  console.log(`=======================================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed successfully');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed successfully');
  });
});
