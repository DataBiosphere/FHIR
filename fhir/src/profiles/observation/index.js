const { loggers } = require('@asymmetrik/node-fhir-server-core');

const { bundleSize } = require('../../config');
const { buildSearchBundle, buildEntry, TCGA_SOURCE, ANVIL_SOURCE } = require('../../utils');
const { TCGA, ANVIL } = require('../../services');
const { buildCompareFn, mergeResults } = require('../../utils/sorting');
const PagingSession = require('../../utils/pagingsession');

const tcga = new TCGA();
const anvil = new ANVIL();
const DEFAULT_SORT = 'disease';

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
    _hash = '',
    _sort = DEFAULT_SORT,
  } = query;
  return { _page, _count, _id, _include, _source, _hash, _sort };
};

const search = async ({ base_version: baseVersion }, { req }) => {
  logger.info('Observation >>> search');
  const { query } = req;
  const { _page, _count, _id, _source, _hash, _sort } = getStandardParameters(query);

  if (_id) {
    const tcgaResult = await tcga.getDiagnosisById(_id).catch((err) => {
      logger.info('_id is not an TCGA ID');
    });
    const anvilResult = await anvil.getObservationById(_id).catch((err) => {
      logger.info('_id is not an ANVIL ID');
    });

    // WARN: this only works because we have two datasets
    //        needs changing for more datasets
    const resource = tcgaResult ? tcgaResult : anvilResult;

    return buildSearchBundle({
      resourceType: 'Observation',
      entries: [buildEntry(resource)],
      page: _page,
      pageSize: _count,
      fhirVersion: baseVersion,
    });
  }

  let currentOffsets = {
    tcga: 0,
    anvil: 0,
  };
  let session = {};
  const pagingSession = new PagingSession();

  if (_hash) {
    session = await pagingSession.get(_hash);
    if (session) {
      currentOffsets = JSON.parse(session.json);
    }
  }

  // create promises and add both adapters
  const params = { page: _page, pageSize: _count, sort: _sort };
  let results = [];
  let count = 0;
  let newHash = '';

  // check for _source and filter promises
  if (_source) {
    switch (_source) {
      case TCGA_SOURCE:
        [results, count] = await tcga.getAllDiagnoses({
          offset: currentOffsets.tcga,
          ...params,
        });
        break;
      case ANVIL_SOURCE:
        [results, count] = await anvil.getAllObservations({
          offset: currentOffsets.anvil,
          ...params,
        });
        break;
      default:
        logger.error('_source is not valid');
        break;
    }
  } else {
    // creates and resolves all promises
    const promises = [];
    promises.push(tcga.getAllDiagnoses({ offset: currentOffsets.tcga, ...params }));
    promises.push(anvil.getAllObservations({ offset: currentOffsets.anvil, ...params }));

    const allResults = await Promise.all(promises);
    count = allResults.map((r) => r[1]).reduce((acc, val) => acc + val);
    const compareFn = buildCompareFn(_sort);
    const [merged, positions] = mergeResults(compareFn, _count, ...allResults.map((r) => r[0]));
    results = merged;

    if (currentOffsets) {
      currentOffsets.tcga += positions[0];
      currentOffsets.anvil += positions[1];
    }
    newHash = await pagingSession.insert({ positions: currentOffsets, previous: _hash });
  }

  return buildSearchBundle({
    resourceType: 'Observation',
    page: _page,
    pageSize: _count,
    fhirVersion: baseVersion,
    total: count,
    entries: results.map((resource) => buildEntry(resource)),
    hashes: {
      prev: session ? session.previous : '',
      self: _hash,
      next: newHash,
    },
  });
};

const searchById = async (args, { req }) => {
  logger.info('Observation >>> searchById');
  const { params } = req;
  const { id } = params;

  // TODO: look into promise.all
  //        https://stackoverflow.com/questions/30362733/handling-errors-in-promise-all
  // queries both databases
  const tcgaResult = await tcga.getDiagnosisById(id).catch((err) => {
    logger.info('id is not an TCGA ID');
  });
  const anvilResult = await anvil.getObservationById(id).catch((err) => {
    logger.info('id is not an ANVIL ID');
  });

  // TODO: add some filter for nulls
  const observation = tcgaResult ? tcgaResult : anvilResult;
  return observation || null;
};

module.exports = {
  search,
  searchById,
};
