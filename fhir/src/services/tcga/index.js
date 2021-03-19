const axios = require('axios');
const memoize = require('fast-memoize');
const { createCache } = require('../../utils');

const { TCGA_URL, TCGA_CACHE_TTL } = process.env;

const ONE_SECOND = 1;

const ONE_MINUTE = ONE_SECOND * 60;

const FIVE_MINUTES = ONE_MINUTE * 5;

const CACHE_TTL = (TCGA_CACHE_TTL || FIVE_MINUTES) * 1000;

const get = memoize(axios.get, {
  cache: createCache(CACHE_TTL),
});

class TCGA {
  constructor() {}

  async getAllDiagnosticReports(params) {
    const { data } = await get(`${TCGA_URL}/api/diagnosticreport`, {
      params,
    });

    const { results, count } = data;
    return [results, count];
  }
  async getDiagnosticReportById(id) {
    const { data } = await get(`${TCGA_URL}/api/diagnosticreport/${id}`);
    return data;
  }

  async getAllObservations(params) {
    const { data } = await get(`${TCGA_URL}/api/observation`, {
      params,
    });

    const { results, count } = data;
    return [results, count];
  }
  async getObservationById(id) {
    const { data } = await get(`${TCGA_URL}/api/observation/${id}`);
    return data;
  }

  async getAllSpecimen(params) {
    const { data } = await get(`${TCGA_URL}/api/specimen`, {
      params,
    });

    const { results, count } = data;
    return [results, count];
  }
  async getSpecimenById(id) {
    const { data } = await get(`${TCGA_URL}/api/specimen/${id}`);
    return data;
  }

  async getAllResearchStudy(params) {
    const { data } = await get(`${TCGA_URL}/api/researchstudy`, {
      params,
    });

    const { results, count } = data;
    return [results, count];
  }
  async getResearchStudyById(id) {
    const { data } = await get(`${TCGA_URL}/api/researchstudy/${id}`);
    return data;
  }

  async getAllPatients(params) {
    const { data } = await get(`${TCGA_URL}/api/patient`, {
      params,
    });

    const { results, count } = data;
    return [results, count];
  }
  async getPatientById(id) {
    const { data } = await get(`${TCGA_URL}/api/patient/${id}`);
    return data;
  }
}

module.exports = TCGA;
