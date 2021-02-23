const axios = require('axios');
const memoize = require('fast-memoize');
const { createCache } = require('../../utils');

const TCGAResourceTranslator = require('./translator');

const { TCGA_URL, TCGA_CACHE_TTL } = process.env;

const ONE_SECOND = 1;

const ONE_MINUTE = ONE_SECOND * 60;

const FIVE_MINUTES = ONE_MINUTE * 5;

const CACHE_TTL = (TCGA_CACHE_TTL || FIVE_MINUTES) * 1000;

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
   * Translate a TCGA Diagnosis response to an Specimen
   *
   * @param {object} diagnosis
   */
  translateBiospecimentoSpecimen(biospecimen) {
    return this.resourceTranslator.toSpecimen(biospecimen);
  }

  translateProjectToResearchStudy(project) {
    return this.resourceTranslator.toResearchStudy(project);
  }

  translateSortParamstoResearchStudyParams(sortFields) {
    return this.resourceTranslator.toResearchStudySortParams(sortFields);
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

    const specimens = tcgaResult.biospecimen.map((biospecimen) =>
      this.translateBiospecimentoSpecimen(biospecimen)
    );

    return { diagnosticReport, observations, specimens };
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

  async getAllSpecimen({ page, pageSize } = {}) {
    const { data } = await get(`${TCGA_URL}/api/biospecimen`, { params: { page, pageSize } });
    const { results, count } = data;
    return [
      results.map((diagnosis) => this.translateBiospecimentoSpecimen(diagnosis, diagnosis)),
      count,
    ];
  }

  async getSpecimenById(id) {
    const { data } = await get(`${TCGA_URL}/api/biospecimen/${id}`);
    return this.translateBiospecimentoSpecimen(data, data);
  }

  async getAllResearchStudy({ pageSize, sort, offset } = {}) {
    const { data } = await get(`${TCGA_URL}/api/projects`, { params: { offset, pageSize, sort: this.translateSortParamstoResearchStudyParams(sort) } });
    const { results, count } = data;
    return [results.map((diagnosis) => this.translateProjectToResearchStudy(diagnosis)), count];
  }

  async getResearchStudyById(id) {
    const { data } = await get(`${TCGA_URL}/api/projects/${id}`);
    return this.translateProjectToResearchStudy(data);
  }
}

module.exports = TCGA;
