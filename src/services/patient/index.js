const { loggers } = require('@asymmetrik/node-fhir-server-core');

const logger = loggers.get();

module.exports.search = async (args) => {
  logger.info('Patient >>> search');
  return [];
};

module.exports.searchById = async (args) => {
  logger.info('Patient >>> searchById');
};

module.exports.create = async (args, { req }) => {
  logger.info('Patient >>> create');
  return {
    id: 'test-id',
  };
};

module.exports.update = async (args, { req }) => {
  logger.info('Patient >>> update');
};

module.exports.remove = async (args, context) => {
  logger.info('Patient >>> remove');
};

module.exports.searchByVersionId = async (args, context) => {
  logger.info('Patient >>> searchByVersionId');
};

module.exports.history = async (args, context) => {
  logger.info('Patient >>> history');
};

module.exports.historyById = async (args, context) => {
  logger.info('Patient >>> historyById');
};

module.exports.patch = async (args, context) => {
  logger.info('Patient >>> patch');
};
