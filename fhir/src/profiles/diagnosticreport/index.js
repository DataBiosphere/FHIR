const { loggers } = require('@asymmetrik/node-fhir-server-core');

const { bundleSize } = require('../../config');
const { buildSearchBundle, buildEntry } = require('../../utils');
const { TCGA } = require('../../services');

const tcga = new TCGA();

const logger = loggers.get();

const includesMapping = {
  'DiagnosticReport:result': 'observations',
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
    const resource = await tcga.getDiagnosticReportById(_id);
    return buildSearchBundle({
      resourceType: 'DiagnosticReport',
      resources: [resource],
      page: _page,
      pageSize: _count,
      fhirVersion: baseVersion,
    });
  }

  const [tcgaResults, count] = await tcga.getAllDiagnosticReports({
    page: _page,
    pageSize: _count,
  });

  tcgaResults.forEach((tcgaResult) => {
    const { diagnosticReport } = tcgaResult;
    resultsSet = resultsSet.concat(buildEntry(diagnosticReport));
    if (_include) {
      const includes = _include.split(',');
      includes.forEach((include) => {
        if (includesMapping[include]) {
          // Add other resources from TCGA
          resultsSet = resultsSet.concat(
            tcgaResult[includesMapping[include]].map((resource) => buildEntry(resource, 'include'))
          );
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
    entries: resultsSet,
  });
};

const searchById = async (args, { req }) => {
  logger.info('DiagnosticReport >>> searchById');
  const { params } = req;
  const { id } = params;
  const { diagnosticReport } = await tcga.getDiagnosticReportById(id);

  return diagnosticReport;
};

module.exports = {
  search,
  searchById,
};
