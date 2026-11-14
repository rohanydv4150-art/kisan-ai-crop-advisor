import axios from 'axios';

// Support direct Render API URL via VITE_API_URL or fallback to local proxy /api/v1
const rawApiUrl = import.meta.env.VITE_API_URL;
const apiBase = rawApiUrl 
  ? `${rawApiUrl.replace(/\/+$/, '')}/api/v1`
  : '/api/v1';

export const api = axios.create({
  baseURL: apiBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Supabase access token or local demo token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kisan_auth_token') || 'demo-farmer-token';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standard error formatting
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);
