# 🌾 KisanAI: AI-Powered Agriculture Crop Advisory Assistant

[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-emerald)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%202.5-purple)](https://aistudio.google.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-green)](https://supabase.com)

A modern, production-grade full-stack digital agricultural advisory assistant designed to empower farmers across India with contextual crop selection, soil health interpretation, balanced nutrient management, growth-stage irrigation scheduling, and plant protection.

---

## 🌟 Key Capabilities

1. **Intelligent Crop Selection Engine**
   - 7-step guided advisory form capturing location, soil type, pH, nutrients (N-P-K), land area, water availability, and season.
   - Generates top 5 suitable crops with calibrated suitability scores, soil compatibility, water needs, and cultivation guidelines.

2. **Soil Health Interpretation**
   - Interprets soil texture, acidity/alkalinity implications, and organic matter status without complex jargon.
   - Prioritized soil amendment recommendations with laboratory soil test guidance.

3. **Fertilizer & Nutrient Guidance**
   - Stage-specific NPK nutrient principles for basal and top-dressing split applications.
   - Organic composting, FYM, and biofertilizers (Azotobacter, PSB, Rhizobium) paired with safety precautions.

4. **Irrigation & Water Management**
   - Water scheduling tailored to moisture-sensitive crop growth stages (flowering, pod/grain filling).
   - Water conservation practices (mulching, drip efficiency, AWD).

5. **Integrated Pest Management (IPM) & Disease Diagnostics**
   - Symptom-based preliminary evaluation of fungal, bacterial, viral, insect, or environmental conditions.
   - Non-chemical biological controls, sanitation hygiene, and clear referral notices to Krishi Vigyan Kendra (KVK) clinics.

6. **Interactive Agricultural Chatbot**
   - Natural language conversational assistant in English and Hindi.
   - Strictly scoped to agricultural domains with automatic out-of-scope redirection.
   - Multi-turn conversation persistence in PostgreSQL.

7. **Farmer Dashboard & Historical Records**
   - Visual distribution analytics using Recharts.
   - Saved crop bookmarking and previous advisory reports review.
   - Meteorological feed integration via WMO agricultural stations (Open-Meteo).

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, TanStack Query, React Hook Form, Zod, Lucide React, Recharts.
- **Backend**: Node.js, Express.js, TypeScript, Helmet, CORS, Express-Rate-Limit, Zod.
- **AI Integration**: Google Gemini via official `@google/genai` SDK with strict JSON schema enforcement.
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) data isolation policies.
- **Testing**: Vitest, Supertest.

---

## 🚀 Quick Start

### 1. Configure Environment
```bash
cp .env.example .env
```
Provide your `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com) and your Supabase credentials.

### 2. Install Dependencies
```bash
# Server packages
cd server && npm install

# Client packages
cd ../client && npm install
```

### 3. Run Development Servers
In terminal 1 (Backend):
```bash
npm run server:dev
# API available at http://localhost:5000/api/v1
```

In terminal 2 (Frontend):
```bash
npm run client:dev
# App available at http://localhost:5173
```

### 4. Run Automated Tests
```bash
npm test
```

---

## 📖 Documentation
- [Setup & Configuration Guide](docs/SETUP.md)
- [Backend REST API Reference](docs/API.md)
- [Database Schema & RLS Policies](docs/DATABASE.md)
- [Production Deployment Guide](docs/DEPLOYMENT.md)

---

## 🛡️ Agricultural Transparency Notice
All AI-generated advisories are decision-support estimates based on supplied parameters. They are not commercial yield guarantees. Always consult your local Krishi Vigyan Kendra (KVK) or state agricultural extension officer before making significant financial commitments.
