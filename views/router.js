const express = require('express');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.post('/visits', (req, res) => {
  res.status(201).json({
    message: 'Visit recorded',
    data: {
      ...req.body,
      resultText: '🜁 (stub) The oracle is warming up...',
    },
  });
});

module.exports = router;
