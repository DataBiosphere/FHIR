const { loggers } = require('@asymmetrik/node-fhir-server-core');

const { bundleSize } = require('../../config');
const { buildSearchBundle } = require('../../utils');
const { TCGA } = require('../../services');

const tcga = new TCGA();

const logger = loggers.get();

const includesMapping = {
  Observation: 'observations',
  DiagnosticReport: 'diagnosticReport',
};

const getStandardParameters = (query) => {
  const {
    _page = 1,
    _count = bundleSize,
    _id,
    _include,
    // _lastUpdated,
    // _profile,
    // _query,
    // _security,
    // _source,
    // _tag,
  } = query;
  return { _page, _count, _id, _include };
};

const search = async ({ base_version: baseVersion }, { req }) => {
  logger.info('DiagnosticReport >>> search');
  const { query } = req;
  const { _page, _count, _id, _include } = getStandardParameters(query);

  let resultsSet = [];

  if (_id) {
    const resource = await tcga.getByCaseId(_id);
    return buildSearchBundle({
      resourceType: 'DiagnosticReport',
      resources: [resource],
      page: _page,
      pageSize: _count,
      fhirVersion: baseVersion,
    });
  }

  const [tcgaResults, count] = await tcga.getAll({
    page: _page,
    pageSize: _count,
  });

  tcgaResults.forEach((tcgaResult) => {
    resultsSet = resultsSet.concat(tcgaResult.diagnosticReport);
    if (_include) {
      const includes = _include.split(',');
      includes.forEach((include) => {
        if (Object.keys(includesMapping).includes(include)) {
          resultsSet = resultsSet.concat(tcgaResult[includesMapping[include]]);
        }
      });
    }
  });

  return buildSearchBundle({
    resourceType: 'DiagnosticReport',
    page: _page,
    pageSize: _count,
    fhirVersion: baseVersion,
    total: count,
    resources: resultsSet,
  });
};

const searchById = async (args, { req }) => {
  logger.info('DiagnosticReport >>> searchById');
  const { params } = req;
  const { id } = params;
  const { diagnosticReport } = await tcga.getByCaseId(id);

  return diagnosticReport;
};

module.exports = {
  search,
  searchById,
};
