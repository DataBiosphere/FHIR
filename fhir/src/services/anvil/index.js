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

  translateSubjecttoObservation(subject) {
    return this.resourceTranslator.toObservation(subject);
  }

  translateSubjecttoPatient(subject) {
    return this.resourceTranslator.toPatient(subject);
  }

  async getAllResearchStudy({ page, pageSize, offset, sort } = {}) {
    const { data } = await get(`${ANVIL_URL}/api/workspace`, {
      params: { page, pageSize, offset, sort: this.translateSortParamstoResearchStudyParams(sort) },
    });

    const { results, count } = data;
    return [results.map((result) => this.translateWorkspacetoResearchStudy(result)), count];
  }
  async getResearchStudyById(id) {
    const { data } = await get(`${ANVIL_URL}/api/workspace/${id}`);
    return this.translateWorkspacetoResearchStudy(data);
  }

  async getAllObservations({ page, pageSize } = {}) {
    const { data } = await get(`${ANVIL_URL}/api/subject`, {
      params: { page, pageSize },
    });

    const { results, count } = data;
    // let count = 0;

    // return [
    //   results.map((result) => {
    //     if (result) {
    //       this.translateSubjecttoObservation(result);
    //       count += 1;
    //     }
    //   }),
    //   count,
    // ];

    return [results.map((result) => this.translateSubjecttoObservation(result)), count];
  }
  async getObservationById(id) {
    const { data } = await get(`${ANVIL_URL}/api/subject/${id}`);
    return this.translateSubjecttoObservation(data);
  }

  async getAllPatients({ page, pageSize } = {}) {
    const { data } = await get(`${ANVIL_URL}/api/subject`, {
      params: { page, pageSize },
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
