const express = require('express');

const app = express();

// Minimal temorary route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
