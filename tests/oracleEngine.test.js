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

test('blessing interpolates seekerName and targetName', () => {
  const result = pickMessage({
    requestType: 'blessing',
    aspect: 'luck',
    seekerName: 'Hawra',
    targetName: 'Ahmed',
  });

  expect(result).toContain('Hawra');
  expect(result).toContain('Ahmed');
});

test('curse interpolates seekerName and targetName', () => {
  const result = pickMessage({
    requestType: 'curse',
    aspect: 'luck',
    seekerName: 'Hawra',
    targetName: 'Ahmed',
  });

  expect(result).toContain('Hawra');
  expect(result).toContain('Ahmed');
});

test('throws if requestType/aspect bucket does not exist', () => {
  expect(() =>
    pickMessage({
      requestType: 'prophecy',
      aspect: 'nonexistent',
      seekerName: 'Hawra',
    })
  ).toThrow('No oracle seeds');
});
