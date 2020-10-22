require('dotenv').config();

const express = require('express');
const logger = require('./logger');
const { router: TCGARouter } = require('./tcga');

const { PORT = 3000 } = process.env;

const app = express();

app.use('/api/tcga', TCGARouter);

app.listen(PORT, () => {
  logger.info(`TCGA Adapter listening on port ${PORT}`);
});
