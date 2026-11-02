import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import app from '../src/app';

test('health endpoint returns service status', async () => {
  const response = await request(app).get('/health');
  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'OK');
});

test('responses include security headers', async () => {
  const response = await request(app).get('/health');
  assert.equal(response.status, 200);
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
});

test('JSON request bodies are size-limited', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .set('Content-Type', 'application/json')
    .send({ email: 'test@example.com', password: 'a'.repeat(1_100_000) });
  assert.equal(response.status, 413);
});

test('report creation requires authentication', async () => {
  const response = await request(app).post('/api/reports').send({});
  assert.equal(response.status, 401);
  assert.equal(response.body.error, 'Authentication required');
});

test('admin reports require authentication', async () => {
  const response = await request(app).get('/api/admin/reports');
  assert.equal(response.status, 401);
  assert.equal(response.body.error, 'Authentication required');
});

test('image uploads require authentication', async () => {
  const response = await request(app).post('/api/uploads');
  assert.equal(response.status, 401);
  assert.equal(response.body.error, 'Authentication required');
});

test('AI classification requires authentication', async () => {
  const response = await request(app).post('/api/ai/classify').send({ imageUrl: 'https://example.test/image.jpg' });
  assert.equal(response.status, 401);
  assert.equal(response.body.error, 'Authentication required');
});

test('registration validates email before database access', async () => {
  const response = await request(app).post('/api/auth/register').send({ email: 'invalid', password: 'password123' });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, 'A valid email is required');
});

test('risk endpoint validates coordinates before database access', async () => {
  const response = await request(app).get('/api/risk?latitude=not-a-number&longitude=0');
  assert.equal(response.status, 400);
  assert.equal(response.body.error, 'Valid latitude and longitude are required');
});
