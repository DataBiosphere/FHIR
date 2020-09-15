const { loggers } = require('@asymmetrik/node-fhir-server-core');

const logger = loggers.get();

module.exports.search = async () => {
  logger.info('Patient >>> search');
  return [];
};

module.exports.searchById = async () => {
  logger.info('Patient >>> searchById');
};

module.exports.create = async () => {
  logger.info('Patient >>> create');
  return {
    id: 'test-id',
  };
};

module.exports.update = async () => {
  logger.info('Patient >>> update');
};

module.exports.remove = async () => {
  logger.info('Patient >>> remove');
};

module.exports.searchByVersionId = async () => {
  logger.info('Patient >>> searchByVersionId');
};

module.exports.history = async () => {
  logger.info('Patient >>> history');
};

module.exports.historyById = async () => {
  logger.info('Patient >>> historyById');
};

module.exports.patch = async () => {
  logger.info('Patient >>> patch');
};
