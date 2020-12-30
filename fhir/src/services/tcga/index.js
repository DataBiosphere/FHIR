const axios = require('axios');
const memoize = require('fast-memoize');
const { createCache } = require('../../utils');

const TCGAResourceTranslator = require('./translator');

const { TCGA_URL, TCGA_CACHE_TTL } = process.env;

const ONE_SECOND = 1;

const ONE_MINUTE = ONE_SECOND * 60;

const CACHE_TTL = (TCGA_CACHE_TTL || ONE_MINUTE) * 1000;

const get = memoize(axios.get, {
  cache: createCache(CACHE_TTL),
});

class TCGA {
  constructor() {
    this.resourceTranslator = new TCGAResourceTranslator();
  }

  /**
   * Translate a TCGA Diagnosis response to an Observation
   *
   * @param {object} diagnosis
   */
  translateDiagnosisToObservation(diagnosis, gdcResult) {
    return this.resourceTranslator.toObservation(diagnosis, gdcResult);
  }

  /**
   * Convert a single TCGA Result to a DiagnosticResource
   *
   * @param {object} tcgaResult
   */
  translateSingleGdcResultsToFhir(tcgaResult) {
    const diagnosticReport = this.resourceTranslator.toDiagnosticReport(tcgaResult);

    const observations = tcgaResult.diagnoses.map((diagnosis) =>
      this.translateDiagnosisToObservation(diagnosis, tcgaResult)
    );

    return { diagnosticReport, observations };
  }

  /**
   * Convert a list of TCGA Results to DiagnosticReports
   *
   * @param {array} tcgaResults
   */
  translateGdcResultsToFhir(tcgaResults) {
    return tcgaResults.map((tcgaResult) => this.translateSingleGdcResultsToFhir(tcgaResult));
  }

  async getAllDiagnosticReports({ page, pageSize } = {}) {
    const { data } = await get(`${TCGA_URL}/api/gdc`, { params: { page, pageSize } });
    const { results, count } = data;
    return [this.translateGdcResultsToFhir(results), count];
  }

  async getDiagnosticReportById(id) {
    const { data } = await get(`${TCGA_URL}/api/gdc/${id}`);
    return this.translateSingleGdcResultsToFhir(data);
  }

  async getAllDiagnoses({ page, pageSize } = {}) {
    const { data } = await get(`${TCGA_URL}/api/diagnosis`, { params: { page, pageSize } });
    const { results, count } = data;
    return [
      results.map((diagnosis) => this.translateDiagnosisToObservation(diagnosis, diagnosis)),
      count,
    ];
  }

  async getDiagnosisById(id) {
    const { data } = await get(`${TCGA_URL}/api/diagnosis/${id}`);
    return this.translateDiagnosisToObservation(data, data);
  }
}

module.exports = TCGA;
