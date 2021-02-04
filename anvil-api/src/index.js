require('dotenv').config();

const express = require('express');
const logger = require('./logger');
const { router: ANVILRouter } = require('./anvil');

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  logger.info(`Request >>> ${req.originalUrl}`);
  next();
});

app.use('/api/', ANVILRouter);

app.listen(PORT, () => {
  logger.info(`ANVIL Adapter listening on port ${PORT}`);
});
