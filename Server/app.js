import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Server is running with Bun!');
});

export default app;