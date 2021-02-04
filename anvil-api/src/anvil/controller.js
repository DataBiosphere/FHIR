const logger = require('../logger');
const service = require('./service');

// TODO: here is an example of the one from TCGA
const getAllGdc = async (req, res) => {
  logger.info('ANVIL >>> getAllGdc');
  const { page, pageSize } = req.query;
  const [results, count] = await service.getAllGdc({ page, pageSize });
  res.json({
    results,
    count,
  });
};
