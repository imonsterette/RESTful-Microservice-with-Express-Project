const express = require('express');
const { randomUUID } = require('crypto');

const router = express.Router();

const { validateVisit } = require('../models/visit');
const { pickMessage } = require('../services/oracleEngine');
const { putVisit } = require('../services/database');
const { scanVisits } = require('../services/database');

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.post('/visits', async (req, res, next) => {
  try {
    const { error, value } = validateVisit(req.body);

    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map((d) => d.message),
      });
    }

    const resultText = pickMessage(value);

    const item = {
      id: randomUUID(),
      ...value,
      resultText,
      createdAt: new Date().toISOString(),
    };

    await putVisit(item);

    return res.status(201).json({
      message: 'Visit recorded',
      data: item,
    });
  } catch (err) {
    return next(err);
  }
});

router.get('/visits', async (req, res, next) => {
  try {
    const visits = await scanVisits();
    res.status(200).json(visits);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
