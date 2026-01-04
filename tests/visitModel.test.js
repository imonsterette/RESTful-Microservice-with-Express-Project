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

  test('blessing missing targetName fails validation', () => {
    const payload = {
      seekerName: 'Hawra',
      requestType: 'blessing',
      aspect: 'luck',
      // targetName missing on purpose
    };

    const { error } = validateVisit(payload);

    expect(error).toBeTruthy();
    expect(error.details[0].path).toEqual(['targetName']);
  });

  test('prophecy must not include targetName', () => {
    const payload = {
      seekerName: 'Hawra',
      requestType: 'prophecy',
      aspect: 'luck',
      targetName: 'Someone',
    };

    const { error } = validateVisit(payload);

    expect(error).toBeTruthy();
    expect(error.details[0].path).toEqual(['targetName']);
  });
});
