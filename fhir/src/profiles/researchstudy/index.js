const { loggers } = require('@asymmetrik/node-fhir-server-core');

const { bundleSize } = require('../../config');
const { buildSearchBundle, buildEntry } = require('../../utils');
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
  logger.info('ResearchStudy >>> search');
  const { query } = req;
  const { _page, _count, _id, _source } = getStandardParameters(query);

  // TODO: check for ANVIL ID
  // {_id: ObjectId("602148085d1432835a7ce1e5")}
  if (_id) {
    const resource = await tcga.getResearchStudyById(_id);
    return buildSearchBundle({
      resourceType: 'ResearchStudy',
      resources: [resource],
      page: _page,
      pageSize: _count,
      fhirVersion: baseVersion,
    });
  }

  // create pomises and add both adapters
  const params = { page: _page, pageSize: _count };
  let results = [];
  let count = 0;

  // check for _source and filter promises
  if (_source) {
    if (_source == 'tcga') {
      [results, count] = await tcga.getAllResearchStudy(params);
    } else if (_source == 'anvil') {
      [results, count] = await anvil.getAllResearchStudy(params);
    } else {
      console.log('_source not valid');
    }
  } else {
    // TODO: add pagination
    // it currently returns TWICE as many results as asked

    // creates and resolves all promises
    const promises = [];
    promises.push(tcga.getAllResearchStudy(params));
    promises.push(anvil.getAllResearchStudy(params));
    await Promise.all(promises).then((promise) => {
      // take each promise and filter it
      promise.forEach((p) => {
        // put each promise result into results
        p[0].forEach((result) => {
          results.push(result);
        });
        // only take the top-level count
        count += p[1];
      });
    });
  }

  return buildSearchBundle({
    resourceType: 'ResearchStudy',
    page: _page,
    pageSize: _count,
    fhirVersion: baseVersion,
    total: count,
    entries: results.map((resource) => buildEntry(resource)),
  });
};

const searchById = async (args, { req }) => {
  logger.info('ResearchStudy >>> searchById');
  const { params } = req;
  const { id } = params;
  const researchStudy = await tcga.getResearchStudyById(id);

  return researchStudy;
};

module.exports = {
  search,
  searchById,
};
