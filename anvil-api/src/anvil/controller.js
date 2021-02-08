const logger = require('../logger');
const service = require('./service');

const getAllWorkspaces = async (req, res) => {
  logger.info('ANVIL >>> getAllWorkspaces');
  const { page, pageSize } = req.query;
  const [results, count] = await service.getAllWorkspaces({ page, pageSize });
  res.json({
    results,
    count,
  });
};

const getWorkspaceById = async (req, res) => {
  logger.info('ANVIL >>> getWorkspaceById');
  const { id } = req.params;
  const results = await service.getWorkspaceById(id);
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
};

module.exports = {
  getAllWorkspaces,
  getWorkspaceById,
};
