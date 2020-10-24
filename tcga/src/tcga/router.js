const express = require('express');
const logger = require('../logger');
const Service = require('./service');

const router = express.Router();

const TCGAService = new Service();

router.get('/', async (req, res) => {
  logger.info('TCGA >>> getAll');
  res.json(await TCGAService.getAll());
});

module.exports = router;
