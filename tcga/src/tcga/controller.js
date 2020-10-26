const logger = require('../logger');
const service = require('./service');

const getAll = async (req, res) => {
  logger.info('TCGA >>> getAll');
  const { page, pageSize } = req.query;
  const tcgaData = await service.getAll({ page, pageSize });
  res.json(tcgaData);
};

module.exports = {
  getAll,
};
