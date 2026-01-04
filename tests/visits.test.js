jest.mock('../services/database', () => ({
  putVisit: jest.fn().mockResolvedValue(true),
}));

const { putVisit } = require('../services/database');

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
      .send('{ "seekerName": "Hawra", }'); // invalid JSON

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

    // Response contract
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');

    // Echoed / validated fields
    expect(res.body.data).toMatchObject({
      seekerName: 'Hawra',
      requestType: 'prophecy',
      aspect: 'luck',
    });

    // Oracle output (real, not stub)
    expect(typeof res.body.data.resultText).toBe('string');
    expect(res.body.data.resultText.length).toBeGreaterThan(0);
    expect(res.body.data.resultText).not.toContain('(stub)');

    // Server-generated fields
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('createdAt');

    // DB call assertions (mocked)
    expect(putVisit).toHaveBeenCalledTimes(1);

    const savedItem = putVisit.mock.calls[0][0];
    expect(savedItem).toMatchObject({
      seekerName: 'Hawra',
      requestType: 'prophecy',
      aspect: 'luck',
    });
    expect(typeof savedItem.id).toBe('string');
    expect(typeof savedItem.createdAt).toBe('string');
  });
});

describe('GET /visits', () => {
  test('returns 200 and an array of visits', async () => {
    const res = await request(app).get('/visits');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
