const express = require('express');
const { randomUUID } = require('crypto');

const router = express.Router();

const { validateVisit, validateVisitUpdate } = require('../models/visit');
const { pickMessage } = require('../services/oracleEngine');
const {
  putVisit,
  scanVisits,
  getVisitById,
  updateVisit,
  deleteVisitById,
} = require('../services/database');
// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Create a visit
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

// List visits
router.get('/visits', async (req, res, next) => {
  try {
    const visits = await scanVisits();
    return res.status(200).json(visits);
  } catch (err) {
    return next(err);
  }
});

// Get one visit by id
router.get('/visits/:id', async (req, res, next) => {
  try {
    const visit = await getVisitById(req.params.id);

    if (!visit) {
      return res.status(404).json({ error: 'Not found' });
    }

    return res.status(200).json(visit);
  } catch (err) {
    return next(err);
  }
});

// Update visit (note)
router.put('/visits/:id', async (req, res, next) => {
  try {
    const existing = await getVisitById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const { error, value } = validateVisitUpdate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map((d) => d.message),
      });
    }

    const patch = {
      note: value.note,
      updatedAt: new Date().toISOString(),
    };

    const updated = await updateVisit(req.params.id, patch);
    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
});

router.delete('/visits/:id', async (req, res, next) => {
  try {
    const existing = await getVisitById(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Not found' });
    }

    await deleteVisitById(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
