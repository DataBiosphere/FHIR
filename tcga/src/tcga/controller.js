const logger = require('../logger');
const service = require('./service');

const getAll = async (req, res) => {
  logger.info('TCGA >>> getAll');
  const { page, pageSize } = req.query;
  const tcgaData = await service.getAll({ page, pageSize });
  res.json(tcgaData);
};

const getById = async (req, res) => {
  logger.info('TCGA >>> getById');
  const { id } = req.params;
  const tcgaData = await service.getById(id);
  res.json(tcgaData);
};

module.exports = {
  getAll,
  getById,
};
