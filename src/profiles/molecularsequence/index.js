const { loggers } = require('@asymmetrik/node-fhir-server-core');

const { bundleSize } = require('../../config');

const MolecularSequenceService = require('../../services/MolecularSequenceService');
const { buildSearchBundle } = require('../../utils');

const molecularSequenceService = new MolecularSequenceService();

const logger = loggers.get();

const search = async (args, { req }) => {
  const { query } = req;
  const { _page = 1, _count = bundleSize } = query;
  logger.info('MolecularSequence >>> search');
  const molecularSequences = await molecularSequenceService.getAll({
    page: _page,
    pageSize: _count,
  });
  return buildSearchBundle({ resources: molecularSequences, page: _page, pageSize: _count });
};

module.exports = {
  search,
};
