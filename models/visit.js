const Joi = require('joi');

const visitSchema = Joi.object({
  seekerName: Joi.string().required(),
  requestType: Joi.string().valid('prophecy', 'blessing', 'curse').required(),
  aspect: Joi.string()
    .valid('health', 'reputation', 'wealth', 'love', 'productivity', 'technology', 'travel', 'luck')
    .required(),
  targetName: Joi.when('requestType', {
    is: Joi.valid('blessing', 'curse'),
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
});

function validateVisit(payload) {
  return visitSchema.validate(payload, { abortEarly: true });
}

const visitUpdateSchema = Joi.object({
  note: Joi.string().min(1).max(280).required(),
});

function validateVisitUpdate(payload) {
  return visitUpdateSchema.validate(payload, { abortEarly: true });
}

module.exports = { visitSchema, validateVisit, visitUpdateSchema, validateVisitUpdate };
