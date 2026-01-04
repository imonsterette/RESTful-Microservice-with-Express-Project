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
describe('Invalid JSON handling', () => {
  test("POST with invalid JSON returns 400 and {error:'Invalid JSON'}", async () => {
    const res = await request(app)
      .post('/visits')
      .set('Content-Type', 'application/json')
      .send('{ "seekerName": "Hawra", }'); // invalid JSON (trailing comma)

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid JSON' });
  });
});

describe('POST /visits', () => {
  test('creates a visit and returns 201 with { message, data }', async () => {
    const payload = {
      seekerName: 'Hawra',
      requestType: 'prophecy',
      aspect: 'luck',
    };

    const res = await request(app).post('/visits').send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');

    expect(res.body.data).toMatchObject({
      seekerName: 'Hawra',
      requestType: 'prophecy',
      aspect: 'luck',
    });

    expect(typeof res.body.data.resultText).toBe('string');
    expect(res.body.data.resultText.length).toBeGreaterThan(0);
  });
});
