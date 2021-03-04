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
  translateSortParamstoObservationParams(sortFields) {
    return sortFields ? this.resourceTranslator.toObservationSortParams(sortFields) : undefined;
  }

  /**
   * Translate a TCGA Biospecimen response to an Specimen
   *
   * @param {object} biospecimen
   */
  translateBiospecimentoSpecimen(biospecimen) {
    return this.resourceTranslator.toSpecimen(biospecimen);
  }

  /**
   * Translate a TCGA project response to a Research Study
   *
   * @param {object} project
   */
  translateProjectToResearchStudy(project) {
    return this.resourceTranslator.toResearchStudy(project);
  }
  translateSortParamstoResearchStudyParams(sortFields) {
    return sortFields ? this.resourceTranslator.toResearchStudySortParams(sortFields) : undefined;
  }
  translateSearchParamsToResearchStudyParams(searchFields) {
    return searchFields ? this.resourceTranslator.toResearchStudySearchParams(searchFields) : undefined;
  }

  /**
   * Translate a TCGA GDC response to an Patient
   *
   * @param {object} biospecimen
   */
  translateGdctoPatient(gdcResult) {
    return this.resourceTranslator.toPatient(gdcResult);
  }
  // TODO: combine this with translateSortParamstoResearchStudyParams
  translateSortParamstoPatientParams(sortFields) {
    return sortFields ? this.resourceTranslator.toPatientSortParams(sortFields) : undefined;
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

  async getAllDiagnoses({ page, pageSize, sort, offset } = {}) {
    const { data } = await get(`${TCGA_URL}/api/diagnosis`, {
      params: { page, pageSize, offset, sort: this.translateSortParamstoObservationParams(sort) },
    });
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

  async getAllResearchStudy({ page, pageSize, sort, offset, search } = {}) {
    const { data } = await get(`${TCGA_URL}/api/projects`, {
      params: {
        page,
        pageSize,
        offset,
        sort: this.translateSortParamstoResearchStudyParams(sort),
        ...this.translateSearchParamsToResearchStudyParams(search)
      },
    });

    const { results, count } = data;
    return [results.map((diagnosis) => this.translateProjectToResearchStudy(diagnosis)), count];
  }
  async getResearchStudyById(id) {
    const { data } = await get(`${TCGA_URL}/api/projects/${id}`);
    return this.translateProjectToResearchStudy(data);
  }

  async getAllPatients({ page, pageSize, sort, offset } = {}) {
    const { data } = await get(`${TCGA_URL}/api/patient`, {
      params: { page, pageSize, offset, sort: this.translateSortParamstoPatientParams(sort) },
    });

    const { results, count } = data;
    return [results.map((gdcResult) => this.translateGdctoPatient(gdcResult)), count];
  }
  async getPatientById(id) {
    const { data } = await get(`${TCGA_URL}/api/patient/${id}`);
    return this.translateGdctoPatient(data);
  }
}

module.exports = TCGA;
