const { loggers, resolveSchema } = require('@asymmetrik/node-fhir-server-core');

const { bundleSize } = require('../../config');
const { buildSearchBundle } = require('../../utils');
const { TCGA } = require('../../services');

const tcga = new TCGA();

const logger = loggers.get();

const getStandardParameters = (query) => {
  const {
    _page = 1,
    _count = bundleSize,
    _id,
    // _lastUpdated,
    // _profile,
    // _query,
    // _security,
    // _source,
    // _tag,
  } = query;
  return { _page, _count, _id };
};

const search = async ({ base_version: baseVersion }, { req }) => {
  logger.info('DiagnosticReport >>> search');
  const { query } = req;
  const { _page, _count, _id } = getStandardParameters(query);

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

  const [resources, count] = await tcga.getAll({
    page: _page,
    pageSize: _count,
  });

  return buildSearchBundle({
    resourceType: 'DiagnosticReport',
    page: _page,
    pageSize: _count,
    fhirVersion: baseVersion,
    total: count,
    resources,
  });
};

const searchById = async ({ baseVersion }, { req }) => {
  logger.info('DiagnosticReport >>> searchById');
  const DiagnosticReport = resolveSchema(baseVersion, 'DiagnosticReport');
  const { params } = req;
  const { id } = params;
  const tcgaResults = await tcga.getByCaseId(id);
  const resource = new DiagnosticReport(tcgaResults);
  return resource;
};

module.exports = {
  search,
  searchById,
};
