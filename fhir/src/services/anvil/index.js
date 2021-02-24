const axios = require('axios');
const memoize = require('fast-memoize');
const { createCache } = require('../../utils');

const ANVILResourceTranslator = require('./translator');

const { ANVIL_URL, ANVIL_CACHE_TTL } = process.env;

const ONE_SECOND = 1;

const ONE_MINUTE = ONE_SECOND * 60;

const FIVE_MINUTES = ONE_MINUTE * 5;

const CACHE_TTL = (ANVIL_CACHE_TTL || FIVE_MINUTES) * 1000;

const get = memoize(axios.get, {
  cache: createCache(CACHE_TTL),
});

class ANVIL {
  constructor() {
    this.resourceTranslator = new ANVILResourceTranslator();
  }

  translateWorkspacetoResearchStudy(workspace) {
    return this.resourceTranslator.toResearchStudy(workspace);
  }
  translateSortParamstoResearchStudyParams(sortFields) {
    return this.resourceTranslator.toResearchStudySortParams(sortFields);
  }

  translateSampletoObservation(sample) {
    return this.resourceTranslator.toObservation(sample);
  }

  translateSubjecttoPatient(subject) {
    return this.resourceTranslator.toPatient(subject);
  }

  async getAllResearchStudy({ page, pageSize, sort, offset } = {}) {
    const { data } = await get(`${ANVIL_URL}/api/Workspace`, {
      params: { offset, pageSize, sort: this.translateSortParamstoResearchStudyParams(sort) },
    });

    const { results, count } = data;
    return [results.map((result) => this.translateWorkspacetoResearchStudy(result)), count];
  }

  async getResearchStudyById(id) {
    const { data } = await get(`${ANVIL_URL}/api/Workspace/${id}`);
    return this.translateWorkspacetoResearchStudy(data);
  }

  async getAllObservations({ page, pageSize } = {}) {
    const { data } = await get(`${ANVIL_URL}/api/Sample`, {
      params: { page, pageSize },
    });

    const { results, count } = data;
    return [results.map((result) => this.translateSampletoObservation(result)), count];
  }

  async getObservationById(id) {
    // you aren't crazy, this API call to /Subject/:id is right
    const { data } = await get(`${ANVIL_URL}/api/Subject/${id}`);
    return this.translateSampletoObservation(data);
  }

  async getAllPatients({ page, pageSize } = {}) {
    const { data } = await get(`${ANVIL_URL}/api/Subject`);
    return this.translateSubjecttoPatient(data);
  }
}

module.exports = ANVIL;
