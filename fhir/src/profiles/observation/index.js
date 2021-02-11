const { loggers } = require('@asymmetrik/node-fhir-server-core');

const { bundleSize } = require('../../config');
const { buildSearchBundle, buildEntry, TCGA_REGEX, ANVIL_REGEX } = require('../../utils');
const { TCGA, ANVIL } = require('../../services');

const tcga = new TCGA();
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
    _source,
    // _tag,
  } = query;
  return { _page, _count, _id, _include, _source };
};

const search = async ({ base_version: baseVersion }, { req }) => {
  logger.info('Observation >>> search');
  const { query } = req;
  const { _page, _count, _id, _source } = getStandardParameters(query);

  if (_id) {
    let resource;
    if (_id.match(TCGA_REGEX)) {
      resource = await tcga.getDiagnosisById(_id);
    } else if (_id.match(ANVIL_REGEX)) {
      // TODO
    }
    return buildSearchBundle({
      resourceType: 'Observation',
      resources: [resource],
      page: _page,
      pageSize: _count,
      fhirVersion: baseVersion,
    });
  }

  // create promises and add both adapters
  const params = { page: _page, pageSize: _count };
  let results = [];
  let count = 0;

  // check for _source and filter promises
  if (_source) {
    if (_source == 'tcga') {
      [results, count] = await tcga.getAllDiagnoses(params);
    } else if (_source == 'anvil') {
      [results, count] = await anvil.getAllObservations(params);
    } else {
      console.log('_source not valid');
    }
  } else {
    // TODO add pagination

    // creates and resolves all promises
    const promises = [];
    promises.push(tcga.getAllDiagnoses(params));
    promises.push(anvil.getAllObservations(params));
    await Promise.all(promises).then((promise) => {
      // filter each promise
      promise.forEach((p) => {
        // put each promise into results
        p[0].forEach((result) => {
          results.push(result);
        });
        // only take top level count
        count += p[1];
      });
    });
  }

  return buildSearchBundle({
    resourceType: 'Observation',
    page: _page,
    pageSize: _count,
    fhirVersion: baseVersion,
    total: count,
    entries: results.map((resource) => buildEntry(resource)),
  });
};

const searchById = async (args, { req }) => {
  logger.info('Observation >>> searchById');
  const { params } = req;
  const { id } = params;

  let observation;
  if (id.match(TCGA_REGEX)) {
    observation = await tcga.getDiagnosisById(id);
  } else if (id.match(ANVIL_REGEX)) {
    observation = await anvil.getObservationById(id);
  }

  return observation;
};

module.exports = {
  search,
  searchById,
};
