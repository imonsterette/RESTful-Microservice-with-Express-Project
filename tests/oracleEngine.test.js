const { pickMessage } = require('../services/oracleEngine');

describe('Oracle engine', () => {
  test('prophecy returns a string', () => {
    const result = pickMessage({
      requestType: 'prophecy',
      aspect: 'luck',
      seekerName: 'Hawra',
    });

    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
