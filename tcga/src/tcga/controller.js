const logger = require('../logger');
const service = require('./service');

const getAll = async (req, res) => {
  logger.info('TCGA >>> getAll');
  res.json(await service.getAll());
};

module.exports = {
  getAll,
};
