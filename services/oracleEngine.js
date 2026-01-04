const { oracleSeeds } = require('./oracleSeeds');

function pickMessage({ requestType, aspect }) {
  const bucket = oracleSeeds?.[requestType]?.[aspect];

  if (!bucket || bucket.length === 0) {
    throw new Error('No oracle seeds for that requestType/aspect');
  }

  // deterministic-ish first pick for now
  return bucket[0];
}

module.exports = { pickMessage };
