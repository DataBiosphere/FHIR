const { loggers } = require('@asymmetrik/node-fhir-server-core');

const MolecularSequenceService = require('../../services/MolecularSequenceService');
const { buildSearchBundle } = require('../../utils');

const molecularSequenceService = new MolecularSequenceService();

const logger = loggers.get();

const search = async () => {
  logger.info('MolecularSequence >>> search');
  const molecularSequences = await molecularSequenceService.getAll();
  return buildSearchBundle(molecularSequences);
};

const searchById = async () => {
  logger.info('MolecularSequence >>> searchById');
};

module.exports = {
  search,
  searchById,
};
