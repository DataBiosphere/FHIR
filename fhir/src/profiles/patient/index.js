const { loggers } = require('@asymmetrik/node-fhir-server-core');

const { bundleSize } = require('../../config');
const { buildSearchBundle, buildEntry, TCGA_SOURCE, ANVIL_SOURCE } = require('../../utils');
const { TCGA, ANVIL } = require('../../services');
const { buildCompareFn, mergeResults } = require('../../utils/sorting');
const PagingSession = require('../../utils/pagingsession');

const tcga = new TCGA();
const anvil = new ANVIL();
const DEFAULT_SORT = 'gender';

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
    _has,
    _text,
  } = query;
  return { _page, _count, _id, _include, _source, _hash, _sort, _has, _text };
};

const search = async ({ base_version: baseVersion }, { req }) => {
  logger.info('Patient >>> search');
  const { query } = req;
  const { _page, _count, _id, _hash, _source, _sort, _has, _text } = getStandardParameters(query);

  if (_id) {
    const tcgaResult = await tcga.getPatientById(_id).catch((err) => {
      logger.info('_id is not a TCGA ID');
    });
    const anvilResult = await anvil.getPatientById(_id).catch((err) => {
      logger.info('_id is not a ANVIL ID');
    });

    // WARN: this only works because we have two datasets
    //        needs changing for more datasets
    const resource = tcgaResult ? tcgaResult : anvilResult;

    return buildSearchBundle({
      resourceType: 'Patient',
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

  // create pomises and add both adapters
  const params = { page: _page, pageSize: _count, sort: _sort };
  let results = [];
  let count = 0;
  let newHash = '';

  // check for _source and filter promises
  if (_source) {
    switch (_source) {
      case TCGA_SOURCE:
        [results, count] = await tcga.getAllPatients({
          offset: currentOffsets.tcga,
          ...params,
        });
        break;
      case ANVIL_SOURCE:
        [results, count] = await anvil.getAllPatients({
          offset: currentOffsets.anvil,
          ...params,
        });
        break;
      default:
        logger.error('_source is not valid');
    }
  } else {
    // creates and resolves all promises
    const promises = [];
    promises.push(tcga.getAllPatients({ offset: currentOffsets.tcga, ...params }));
    promises.push(anvil.getAllPatients({ offset: currentOffsets.anvil, ...params }));

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
    resourceType: 'Patient',
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
  logger.info('Patient >>> searchById');
  const { params } = req;
  const { id } = params;

  // TODO: look into promise.all
  //        https://stackoverflow.com/questions/30362733/handling-errors-in-promise-all
  // queries both databases
  const tcgaResult = await tcga.getPatientById(id).catch((err) => {
    logger.info('_id is not a TCGA ID');
  });
  const anvilResult = await anvil.getPatientById(id).catch((err) => {
    logger.info('_id is not a ANVIL ID');
  });

  // TODO: add some filter for nulls
  return tcgaResult ? tcgaResult : anvilResult;
};

module.exports = {
  search,
  searchById,
};
