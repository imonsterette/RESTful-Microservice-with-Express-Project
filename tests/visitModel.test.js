const { validateVisit } = require('../models/visit');

describe('Visit validation', () => {
  test('missing seekerName fails validation', () => {
    const payload = {
      requestType: 'prophecy',
      aspect: 'luck',
    };

    const { error } = validateVisit(payload);

    expect(error).toBeTruthy();
    expect(error.details[0].path).toEqual(['seekerName']);
  });
});
