const { loggers } = require('@asymmetrik/node-fhir-server-core');

const { bundleSize } = require('../../config');
const { buildSearchBundle, buildEntry, TCGA_SOURCE, ANVIL_SOURCE } = require('../../utils');
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
    const tcgaResult = await tcga.getDiagnosisById(_id).catch((err) => {
      logger.info('_id is not an TCGA ID');
    });
    const anvilResult = await anvil.getObservationById(_id).catch((err) => {
      logger.info('_id is not an ANVIL ID');
    });

    const resource = tcgaResult ? tcgaResult : anvilResult;

    return buildSearchBundle({
      resourceType: 'Observation',
      entries: [buildEntry(resource)],
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
    if (_source == TCGA_SOURCE) {
      [results, count] = await tcga.getAllDiagnoses(params);
    } else if (_source == ANVIL_SOURCE) {
      [results, count] = await anvil.getAllObservations(params);
    } else {
      logger.error('_source is not valid');
    }
  } else {
    // TODO: add pagination

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

  // queries both databases
  const tcgaResult = await tcga.getDiagnosisById(id).catch((err) => {
    logger.info('id is not an TCGA ID');
  });
  const anvilResult = await anvil.getObservationById(id).catch((err) => {
    logger.info('id is not an ANVIL ID');
  });

  const observation = tcgaResult ? tcgaResult : anvilResult;
  return observation;
};

module.exports = {
  search,
  searchById,
};
