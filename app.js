const express = require('express');

const app = express();

// Minimal temorary route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// json 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
