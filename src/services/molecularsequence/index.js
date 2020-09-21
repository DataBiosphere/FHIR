const { loggers } = require('@asymmetrik/node-fhir-server-core');

const logger = loggers.get();

module.exports.search = async () => {
  logger.info('MolecularSequence >>> search');
  return [];
};

module.exports.searchById = async () => {
  logger.info('MolecularSequence >>> searchById');
};

module.exports.create = async () => {
  logger.info('MolecularSequence >>> create');
  return {
    id: 'temp-test-id',
  };
};

module.exports.update = async () => {
  logger.info('MolecularSequence >>> update');
};

module.exports.remove = async () => {
  logger.info('MolecularSequence >>> remove');
};

module.exports.searchByVersionId = async () => {
  logger.info('MolecularSequence >>> searchByVersionId');
};

module.exports.history = async () => {
  logger.info('MolecularSequence >>> history');
};

module.exports.historyById = async () => {
  logger.info('MolecularSequence >>> historyById');
};

module.exports.patch = async () => {
  logger.info('MolecularSequence >>> patch');
};
