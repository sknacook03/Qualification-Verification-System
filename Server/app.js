import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.get('/', (req, res) => {
  res.send('Server is running with Bun!');
});

app.use(bodyParser.json())

export default app;