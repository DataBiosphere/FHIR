const logger = require('../logger');
const service = require('./service');

const getAllWorkspaces = async (req, res) => {
  logger.info('ANVIL >>> getAllWorkspaces');
  const { page, pageSize } = req.query;
  const [results, count] = await service.getAllWorkspaces({ page, pageSize });
  res.json({
    results,
    count
  });
};

module.exports = {
  getAllWorkspaces
};
