const Joi = require('joi');

const visitSchema = Joi.object({
  seekerName: Joi.string().required(),
  requestType: Joi.string().valid('prophecy', 'blessing', 'curse').required(),
  aspect: Joi.string()
    .valid('health', 'reputation', 'wealth', 'love', 'productivity', 'technology', 'travel', 'luck')
    .required(),
});

function validateVisit(payload) {
  return visitSchema.validate(payload, { abortEarly: true });
}

module.exports = { visitSchema, validateVisit };
