const { loggers } = require('@asymmetrik/node-fhir-server-core');

const { bundleSize } = require('../../config');
const { buildSearchBundle, buildEntry } = require('../../utils');
const { TCGA } = require('../../services');

const tcga = new TCGA();

const logger = loggers.get();

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
  logger.info('Specimen >>> search');
  const { query } = req;
  const { _page, _count, _id } = getStandardParameters(query);

  if (_id) {
    const resource = await tcga.getSpecimenById(_id);
    return buildSearchBundle({
      resourceType: 'Specimen',
      resources: [resource],
      page: _page,
      pageSize: _count,
      fhirVersion: baseVersion,
    });
  }

  const [results, count] = await tcga.getAllSpecimen({
    page: _page,
    pageSize: _count,
  });

  return buildSearchBundle({
    resourceType: 'Specimen',
    page: _page,
    pageSize: _count,
    fhirVersion: baseVersion,
    total: count,
    entries: results.map((resource) => buildEntry(resource)),
  });
};

const searchById = async (args, { req }) => {
  logger.info('Specimen >>> searchById');
  const { params } = req;
  const { id } = params;
  const specimen = await tcga.getSpecimenById(id);

  return specimen;
};

module.exports = {
  search,
  searchById,
};
