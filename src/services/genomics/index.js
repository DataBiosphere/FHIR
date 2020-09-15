const { loggers } = require('@asymmetrik/node-fhir-server-core');

const logger = loggers.get();

module.exports.search = async (args) => {
  logger.info('Genomics >>> search');
  return [];
};

module.exports.searchById = async (args) => {
  logger.info('Genomics >>> searchById');
};

module.exports.create = async (args, { req }) => {
  logger.info('Genomics >>> create');
  return {
    id: 'test-id',
  };
};

module.exports.update = async (args, { req }) => {
  logger.info('Genomics >>> update');
};

module.exports.remove = async (args, context) => {
  logger.info('Genomics >>> remove');
};

module.exports.searchByVersionId = async (args, context) => {
  logger.info('Genomics >>> searchByVersionId');
};

module.exports.history = async (args, context) => {
  logger.info('Genomics >>> history');
};

module.exports.historyById = async (args, context) => {
  logger.info('Genomics >>> historyById');
};

module.exports.patch = async (args, context) => {
  logger.info('Genomics >>> patch');
};
