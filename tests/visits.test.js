const request = require('supertest');
const app = require('../app');

describe('Health check', () => {
  test("GET /health returns 200 and {status:'ok'}", async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('404 handling', () => {
  test('unknown route returns 404 with JSON error', async () => {
    const res = await request(app).get('/nope');

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });
  });
});
