jest.mock('../services/database', () => ({
  putVisit: jest.fn().mockResolvedValue(true),
  scanVisits: jest.fn().mockResolvedValue([]),
  getVisitById: jest.fn(),
}));

const { putVisit, scanVisits, getVisitById } = require('../services/database');

const request = require('supertest');
const app = require('../app');

beforeEach(() => {
  jest.clearAllMocks();
});

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
  test('returns visits from the database scan', async () => {
    scanVisits.mockResolvedValueOnce([
      {
        id: 'fake-id',
        seekerName: 'Hawra',
        requestType: 'prophecy',
        aspect: 'luck',
        resultText: '🍀 A small risk will pay off soon.',
        createdAt: '2026-01-04T00:00:00.000Z',
      },
    ]);

    const res = await request(app).get('/visits');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toMatchObject({
      id: 'fake-id',
      seekerName: 'Hawra',
    });
    // DB interaction contract
    expect(scanVisits).toHaveBeenCalledTimes(1);
  });
});

describe('GET /visits/:id', () => {
  test('returns 200 and the visit when it exists', async () => {
    getVisitById.mockResolvedValueOnce({
      id: 'id-123',
      seekerName: 'Hawra',
      requestType: 'prophecy',
      aspect: 'luck',
      resultText: '🍀 A small risk will pay off soon.',
      createdAt: '2026-01-04T00:00:00.000Z',
    });

    const res = await request(app).get('/visits/id-123');

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      id: 'id-123',
      seekerName: 'Hawra',
    });

    expect(getVisitById).toHaveBeenCalledTimes(1);
    expect(getVisitById).toHaveBeenCalledWith('id-123');
  });

  test('returns 404 when visit does not exist', async () => {
    getVisitById.mockResolvedValueOnce(null);

    const res = await request(app).get('/visits/missing-id');

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });

    expect(getVisitById).toHaveBeenCalledTimes(1);
    expect(getVisitById).toHaveBeenCalledWith('missing-id');
  });
});
