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
  logger.info('Observation >>> search');
  const { query } = req;
  const { _page, _count, _id } = getStandardParameters(query);

  if (_id) {
    const resource = await tcga.getByCaseId(_id);
    return buildSearchBundle({
      resourceType: 'Observation',
      resources: [resource],
      page: _page,
      pageSize: _count,
      fhirVersion: baseVersion,
    });
  }

  const [results, count] = await tcga.getAll({
    page: _page,
    pageSize: _count,
  });

  console.log(results);

  return buildSearchBundle({
    resourceType: 'Observation',
    page: _page,
    pageSize: _count,
    fhirVersion: baseVersion,
    total: count,
    resources: results
      .map((result) => result.observations)
      .reduce((accum, observations) => accum.concat(observations), []),
  });
};

const searchById = async (args, { req }) => {
  logger.info('Observation >>> searchById');
  const { params } = req;
  const { id } = params;
  const { observations } = await tcga.getByCaseId(id);

  return observations;
};

module.exports = {
  search,
  searchById,
};
