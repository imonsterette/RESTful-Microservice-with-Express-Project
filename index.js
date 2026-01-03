const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔮 Clouded Oracle V2 listening on port ${PORT}`);
});
