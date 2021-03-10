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
  translateSortParamstoObservationParams(sortFields) {
    return sortFields ? this.resourceTranslator.toObservationSortParams(sortFields) : undefined;
  }

  translateSubjecttoPatient(subject) {
    return this.resourceTranslator.toPatient(subject);
  }
  translateSortParamstoPatientParams(sortFields) {
    return sortFields ? this.resourceTranslator.toPatientSortParams(sortFields) : undefined;
  }

  async getAllResearchStudy({ _page, _count, _offset, _sort } = {}) {
    const { data } = await get(`${ANVIL_URL}/api/researchstudy`, {
      params: { _page, _count, _offset, _sort },
    });

    const { results, count } = data;
    return [results, count];
  }
  async getResearchStudyById(id) {
    const { data } = await get(`${ANVIL_URL}/api/researchstudy/${id}`);
    return data;
  }

  async getAllObservations({ _page, _count, _offset, _sort } = {}) {
    const { data } = await get(`${ANVIL_URL}/api/observation`, {
      params: { _page, _count, _offset, _sort },
    });

    const { results, count } = data;
    return [results, count];
  }
  async getObservationById(id) {
    const { data } = await get(`${ANVIL_URL}/api/observation/${id}`);
    return data;
  }

  async getAllPatients({ _page, _count, _offset, _sort } = {}) {
    const { data } = await get(`${ANVIL_URL}/api/patient`, {
      params: { _page, _count, _offset, _sort },
    });

    const { results, count } = data;
    return [results, count];
  }
  async getPatientById(id) {
    const { data } = await get(`${ANVIL_URL}/api/patient/${id}`);
    return data;
  }
}

module.exports = ANVIL;
