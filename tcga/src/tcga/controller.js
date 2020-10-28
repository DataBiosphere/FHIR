const logger = require('../logger');
const service = require('./service');

const getAll = async (req, res) => {
  logger.info('TCGA >>> getAll');
  const { page, pageSize } = req.query;
  const [results, count] = await service.getAll({ page, pageSize });
  res.json({
    results,
    count,
  });
};

const getById = async (req, res) => {
  logger.info('TCGA >>> getById');
  const { id } = req.params;
  const results = await service.getById(id);
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
};

module.exports = {
  getAll,
  getById,
};
