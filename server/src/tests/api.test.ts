import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

const app = createApp();
const DEMO_TOKEN = 'Bearer demo-farmer-token';

describe('Agriculture Advisory Assistant REST API', () => {
  describe('System Health Endpoint', () => {
    it('GET /api/v1/health should return status UP', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('UP');
    });
  });

  describe('Authentication & Protected Routes', () => {
    it('should reject unauthorized requests to /api/v1/profile without token', async () => {
      const res = await request(app).get('/api/v1/profile');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });

    it('should allow authenticated requests with Bearer token', async () => {
      const res = await request(app)
        .get('/api/v1/profile')
        .set('Authorization', DEMO_TOKEN);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('full_name');
    });
  });

  describe('Farmer Profile API', () => {
    it('PATCH /api/v1/profile should update farmer parameters', async () => {
      const updateData = {
        full_name: 'Suresh Kumar',
        state: 'Punjab',
        district: 'Ludhiana',
        farming_experience: 15,
        default_land_area: 5.0,
        land_unit: 'acre',
      };

      const res = await request(app)
        .patch('/api/v1/profile')
        .set('Authorization', DEMO_TOKEN)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.full_name).toBe('Suresh Kumar');
      expect(res.body.data.district).toBe('Ludhiana');
    });
  });

  describe('Weather Integration API', () => {
    it('GET /api/v1/weather/current should respond with meteorological data', async () => {
      const res = await request(app)
        .get('/api/v1/weather/current')
        .query({ state: 'Karnataka', district: 'Bengaluru' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('temperature');
      expect(res.body.data).toHaveProperty('is_live');
      expect(res.body.data).toHaveProperty('provider');
    });
  });

  describe('Dashboard Summary API', () => {
    it('GET /api/v1/dashboard/summary should return metrics and charts data', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', DEMO_TOKEN);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('metrics');
      expect(res.body.data).toHaveProperty('charts');
      expect(res.body.data.charts).toHaveProperty('type_distribution');
    });
  });

  describe('Validation Error Handling', () => {
    it('POST /api/v1/advisory/crop should return 400 when missing required body fields', async () => {
      const res = await request(app)
        .post('/api/v1/advisory/crop')
        .set('Authorization', DEMO_TOKEN)
        .send({
          location: { state: '' }, // invalid
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(Array.isArray(res.body.details)).toBe(true);
    });
  });
});
