const { oracleSeeds } = require('./oracleSeeds');

function pickMessage({ requestType, aspect, seekerName, targetName }) {
  const bucket = oracleSeeds?.[requestType]?.[aspect];

  if (!bucket || bucket.length === 0) {
    throw new Error('No oracle seeds for that requestType/aspect');
  }

  let message = bucket[0];

  if (seekerName) {
    message = message.replace('{seeker}', seekerName);
  }

  if (targetName) {
    message = message.replace('{target}', targetName);
  }

  return message;
}

module.exports = { pickMessage };
