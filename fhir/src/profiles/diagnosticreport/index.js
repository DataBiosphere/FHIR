const { loggers } = require('@asymmetrik/node-fhir-server-core');

const { bundleSize } = require('../../config');
const { buildSearchBundle, buildEntry, TCGA_SOURCE } = require('../../utils');
const { TCGA } = require('../../services');
const PagingSession = require('../../utils/pagingsession');

const tcga = new TCGA();
const DEFAULT_SORT = 'issued';

const logger = loggers.get();

// TODO: have to fix this
const includesMapping = {
  'DiagnosticReport:result': 'observations',
};

const getStandardParameters = (query) => {
  const {
    _page = 1,
    _count = bundleSize,
    _id,
    _include, // TODO: have to fix this
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
  logger.info('DiagnosticReport >>> search');
  const { query } = req;
  const { _page, _count, _id, _include, _source, _hash, _sort } = getStandardParameters(query);

  if (_id) {
    const resource = await tcga.getDiagnosticReportById(_id);

    let entries = [];
    if (resource) {
      entries = [buildEntry(resource)];
    }

    return buildSearchBundle({
      resourceType: 'DiagnosticReport',
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
  const params = { _page, _include, _count, _sort };
  let results = [];
  let count = 0;
  let newHash = '';

  if (_source) {
    switch (_source) {
      case TCGA_SOURCE:
        [results, count] = await tcga.getAllDiagnosticReports({
          _offset: currentOffsets.tcga,
          ...params,
        });
        break;
      default:
        logger.error('_source is not valid');
        break;
    }
  } else {
    [results, count] = await tcga.getAllDiagnosticReports({
      _offset: currentOffsets.tcga,
      ...params,
    });

    newHash = await pagingSession.insert({ positions: currentOffsets, previous: _hash });
  }

  /*tcgaResults.forEach((tcgaResult) => {
    const { diagnosticReport } = tcgaResult;
    resultsSet = resultsSet.concat(buildEntry(diagnosticReport));
    if (_include) {
      const includes = _include.split(',');
      includes.forEach((include) => {
        if (includesMapping[include]) {
          // Add other resources from TCGA
          resultsSet = resultsSet.concat(
            tcgaResult[includesMapping[include]].map((resource) => buildEntry(resource, 'include'))
          );
        }
      });
    }
  });*/

  return buildSearchBundle({
    resourceType: 'DiagnosticReport',
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
  logger.info('DiagnosticReport >>> searchById');
  const { params } = req;
  const { id } = params;

  const diagnosticReport = await tcga.getDiagnosticReportById(id);

  return diagnosticReport;
};

module.exports = {
  search,
  searchById,
};
