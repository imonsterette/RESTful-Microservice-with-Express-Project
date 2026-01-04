const express = require('express');

const app = express();

// Parse JSON bodies (and surface invalid JSON as an error we handle below)
app.use(express.json());

const router = require('./views/router');
app.use(router);

// Invalid JSON handler (must have 4 args to be treated as error middleware)
app.use((err, req, res, next) => {
  const isInvalidJson = err instanceof SyntaxError && err.status === 400 && 'body' in err;

  if (isInvalidJson) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  return next(err);
});

// JSON 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
