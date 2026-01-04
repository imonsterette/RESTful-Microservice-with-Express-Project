const express = require('express');

const router = express.Router();
const { validateVisit } = require('../models/visit');
const { pickMessage } = require('../services/oracleEngine');

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.post('/visits', (req, res) => {
  const { error, value } = validateVisit(req.body);

  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map((d) => d.message),
    });
  }

  const resultText = pickMessage(value);

  res.status(201).json({
    message: 'Visit recorded',
    data: {
      ...value,
      resultText,
    },
  });
});
module.exports = router;
