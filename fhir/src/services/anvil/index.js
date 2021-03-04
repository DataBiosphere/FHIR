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
    return sortFields ? this.resourceTranslator.toResearchStudySortParams(sortFields) : undefined;
  }

  translateSearchParamstoResearchStudyParams(searchFields) {
    return searchFields ? this.resourceTranslator.toResearchStudySearchParams(searchFields) : undefined;
  }

  translateSubjecttoObservation(subject) {
    return this.resourceTranslator.toObservation(subject);
  }
  translateSortParamstoObservationParams(sortFields) {
    return sortFields ? this.resourceTranslator.toObservationSortParams(sortFields) : undefined;
  }

  translateSubjecttoPatient(subject) {
    return this.resourceTranslator.toPatient(subject);
  }
  translateSortParamstoPatientParams(sortFields) {
    return sortFields ? this.resourceTranslator.toPatientSortParams(sortFields) : undefined;
  }

  async getAllResearchStudy({ page, pageSize, offset, sort, search } = {}) {
    const { data } = await get(`${ANVIL_URL}/api/workspace`, {
      params: {
        page,
        pageSize,
        offset,
        sort: this.translateSortParamstoResearchStudyParams(sort),
        ...this.translateSearchParamstoResearchStudyParams(search)
      },
    });

    const { results, count } = data;
    return [results.map((result) => this.translateWorkspacetoResearchStudy(result)), count];
  }
  async getResearchStudyById(id) {
    const { data } = await get(`${ANVIL_URL}/api/workspace/${id}`);
    return this.translateWorkspacetoResearchStudy(data);
  }

  async getAllObservations({ page, pageSize, offset, sort } = {}) {
    const { data } = await get(`${ANVIL_URL}/api/observation`, {
      params: { page, pageSize, offset, sort: this.translateSortParamstoObservationParams(sort) },
    });

    const { results, count } = data;
    return [results.map((result) => this.translateSubjecttoObservation(result)), count];
  }
  async getObservationById(id) {
    const { data } = await get(`${ANVIL_URL}/api/observation/${id}`);
    return this.translateSubjecttoObservation(data);
  }

  async getAllPatients({ page, pageSize, offset, sort } = {}) {
    const { data } = await get(`${ANVIL_URL}/api/subject`, {
      params: { page, pageSize, offset, sort: this.translateSortParamstoPatientParams(sort) },
    });

    const { results, count } = data;
    return [results.map((result) => this.translateSubjecttoPatient(result)), count];
  }
  async getPatientById(id) {
    const { data } = await get(`${ANVIL_URL}/api/subject/${id}`);
    return this.translateSubjecttoPatient(data);
  }
}

module.exports = ANVIL;
