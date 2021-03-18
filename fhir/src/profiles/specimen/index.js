const { loggers } = require('@asymmetrik/node-fhir-server-core');

const { bundleSize } = require('../../config');
const { buildSearchBundle, buildEntry, TCGA_SOURCE } = require('../../utils');
const { TCGA } = require('../../services');
const PagingSession = require('../../utils/pagingsession');

const tcga = new TCGA();
const DEFAULT_SORT = '';

const logger = loggers.get();

const getStandardParameters = (query) => {
  const {
    _page = 1,
    _count = bundleSize,
    _id,
    // _include,
    // _lastUpdated,
    // _profile,
    // _query,
    // _security,
    _source,
    // _tag,
    _hash = '',
    _sort = DEFAULT_SORT,
  } = query;
  return { _page, _count, _id, _source, _hash, _sort };
};

const search = async ({ base_version: baseVersion }, { req }) => {
  logger.info('Specimen >>> search');
  const { query } = req;
  const { _page, _count, _id, _source, _hash, _sort } = getStandardParameters(query);

  if (_id) {
    const resource = await tcga.getSpecimenById(_id);

    let entries = [];
    if (resource) {
      entries = [buildEntry(resource)];
    }

    return buildSearchBundle({
      resourceType: 'Specimen',
      entries: entries,
      page: _page,
      pageSize: _count,
      fhirVersion: baseVersion,
    });
  }

  // create offsets
  let currentOffsets = {
    tcga: 0,
  };
  let session = {};
  const pagingSession = new PagingSession();

  if (_hash) {
    session = await pagingSession.get(_hash);
    if (session) {
      currentOffsets = JSON.parse(session.json);
    }
  }

  // create results
  const params = Object.assign(req.query, {});
  delete params._hash;
  let results = [];
  let count = 0;
  let newHash = '';

  if (_source) {
    switch (_source) {
      case TCGA_SOURCE:
        [results, count] = await tcga.getAllSpecimen({
          _offset: currentOffsets.tcga,
          ...params,
        });
        break;
      default:
        logger.error('_source is not valid');
        break;
    }
  } else {
    [results, count] = await tcga.getAllSpecimen({
      _offset: currentOffsets.tcga,
      ...params,
    });

    newHash = await pagingSession.insert({ positions: currentOffsets, previous: _hash });
  }

  return buildSearchBundle({
    resourceType: 'Specimen',
    page: _page,
    pageSize: _count,
    fhirVersion: baseVersion,
    total: count,
    entries: results.map((resource) => buildEntry(resource)),
    hashes: {
      prev: session ? session.previous : '',
      _self: _hash,
      next: newHash,
    },
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
