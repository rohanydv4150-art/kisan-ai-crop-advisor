# Setup & Getting Started Guide

## AI-Powered Agriculture Crop Advisory Assistant (KisanAI)

This guide walks you through setting up the application locally and connecting required services.

---

## 1. Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher (LTS recommended)
- **npm**: v9.0.0 or higher
- **Supabase Account**: (Free tier at [supabase.com](https://supabase.com))
- **Google AI Studio Account**: (API key at [aistudio.google.com](https://aistudio.google.com))

---

## 2. Clone and Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your credentials:
   ```env
   # Application
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:5173

   # Supabase Configuration
   # Obtain from your Supabase Dashboard -> Settings -> API
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # Google Gemini AI Configuration
   # Obtain from https://aistudio.google.com
   GEMINI_API_KEY=your-google-gemini-api-key
   GEMINI_MODEL=gemini-2.5-flash

   # Weather Meteorological Service
   # Open-Meteo is built-in with zero configuration for agricultural weather
   WEATHER_PROVIDER=open-meteo
   ```

---

## 3. Database Migration Setup (Supabase)

1. Log in to [Supabase](https://supabase.com) and create a new project.
2. In the Supabase Dashboard, navigate to the **SQL Editor**.
3. Open and run the schema migration in `supabase/migrations/20240101000000_init_agriculture_schema.sql`:
   - Creates `farmer_profiles`, `advisory_reports`, `chat_conversations`, `chat_messages`, `weather_records`, `saved_crops`, `notifications`.
   - Adds indexes and updated-at triggers.
4. Run the security migration in `supabase/migrations/20240101000001_rls_policies.sql`:
   - Enables Row Level Security (RLS) on all tables.
   - Enforces strict user isolation policies `(auth.uid() = user_id)`.
5. (Optional) Run `supabase/seed.sql` to install helper routines.

---

## 4. Google Gemini Configuration

1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Click **Create API Key**.
3. Copy your key into `GEMINI_API_KEY` in `.env`.
4. The system is calibrated for `gemini-2.5-flash` or `gemini-1.5-flash`.

> **Note on Security:** The Gemini API key is accessed strictly server-side through `@google/genai` inside `server/src/services/gemini.service.ts`. It is never exposed in client bundles.

---

## 5. Installing Dependencies

Install dependencies for both the backend server and frontend client:

```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

---

## 6. Running the Application

### Development Mode

Run the backend server:
```bash
# From workspace root
npm run server:dev

# Or from server directory
cd server
npm run dev
```
Backend API will be live at `http://localhost:5000/api/v1`.

In a separate terminal, run the frontend client:
```bash
# From workspace root
npm run client:dev

# Or from client directory
cd client
npm run dev
```
Frontend Web App will be available at `http://localhost:5173`.

---

## 7. Running Automated Tests

To run the Vitest backend test suite:
```bash
npm test
```
This tests:
- Crop advisory input validation
- AI structured response schema validation
- Authentication & Bearer token authorization
- Weather integration handling
- Centralized error handling
