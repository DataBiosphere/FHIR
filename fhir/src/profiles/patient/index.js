const { loggers } = require('@asymmetrik/node-fhir-server-core');

const { bundleSize } = require('../../config');
const { buildSearchBundle, buildEntry } = require('../../utils');
const { ANVIL } = require('../../services');

const anvil = new ANVIL();

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
    _has,
    _text,
  } = query;
  return { _page, _count, _id, _include, _has, _text };
};

const search = async ({ base_version: baseVersion }, { req }) => {
  logger.info('Patient >>> search');
  const { query } = req;
  const { _page, _count, _id, _has, _text } = getStandardParameters(query);

  if (_id) {
    const resource = await anvil.getPatientById(_id);

    return buildSearchBundle({
      resourceType: 'Patient',
      entries: [buildEntry(resource)],
      page: _page,
      pageSize: _count,
      fhirVersion: baseVersion,
    });
  }

  // get all the patients
  const [results, count] = await anvil.getAllPatients({
    page: _page,
    pageSize: _count,
  });

  return buildSearchBundle({
    resourceType: 'Patient',
    page: _page,
    pageSize: _count,
    fhirVersion: baseVersion,
    total: count,
    entries: results.map((resource) => buildEntry(resource)),
  });
};

const searchById = async (args, { req }) => {
  logger.info('Patient >>> searchById');
  const { params } = req;
  const { id } = params;
  const specimen = await anvil.getAllPatients(id);

  return specimen;
};

module.exports = {
  search,
  searchById,
};
