const { loggers } = require('@asymmetrik/node-fhir-server-core');

const { bundleSize } = require('../../config');
const { buildSearchBundle } = require('../../utils');
const { TCGA } = require('../../services');

const tcga = new TCGA();

const logger = loggers.get();

const search = async ({ base_version: baseVersion }, { req }) => {
  logger.info('DiagnosticReport >>> search');
  const { query } = req;
  const { _page = 1, _count = bundleSize } = query;
  const { data } = await tcga.getAll({
    page: _page,
    pageSize: _count,
  });
  return buildSearchBundle({
    resourceType: 'DiagnosticReport',
    resources: data,
    page: _page,
    pageSize: _count,
    fhirVersion: baseVersion,
  });
};

const searchById = async (args, { req }) => {
  logger.info('DiagnosticReport >>> search');
  const { params } = req;
  const { id } = params;
  const resource = await tcga.getByCaseId(id);
  return resource;
};

module.exports = {
  search,
  searchById,
};
