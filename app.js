const express = require('express');

const app = express();

app.use(express.json());

// Minimal temorary route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((err, req, res, next) => {
  const isInvalidJson = err instanceof SyntaxError && err.status === 400 && 'body' in err;

  if (isInvalidJson) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // Anything else: pass along
  return next(err);
});
// json 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
