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

  async getAllDiagnosticReports({ _page, _count, _sort, _offset } = {}) {
    const { data } = await get(`${TCGA_URL}/api/diagnosticreport`, { params: { _page, _count, _sort, _offset } });
    const { results, count } = data;
    return [results, count];
  }
  async getDiagnosticReportById(id) {
    const { data } = await get(`${TCGA_URL}/api/diagnosticreport/${id}`);
    return data;
  }

  async getAllObservations({ _page, _count, _sort, _offset } = {}) {
    const { data } = await get(`${TCGA_URL}/api/observation`, {
      params: { _page, _count, _offset, _sort },
    });
    const { results, count } = data;
    return [
      results,
      count,
    ];
  }
  async getObservationById(id) {
    const { data } = await get(`${TCGA_URL}/api/observation/${id}`);
    return data;
  }

  async getAllSpecimen({ _page, _count, _sort, _offset } = {}) {
    const { data } = await get(`${TCGA_URL}/api/specimen`, { params: { _page, _count, _sort, _offset } });
    const { results, count } = data;
    return [
      results,
      count,
    ];
  }
  async getSpecimenById(id) {
    const { data } = await get(`${TCGA_URL}/api/specimen/${id}`);
    return data;
  }

  async getAllResearchStudy({ _page, _count, _sort, _offset } = {}) {
    const { data } = await get(`${TCGA_URL}/api/researchstudy`, {
      params: { _page, _count, _offset, _sort},
    });

    const { results, count } = data;
    return [results, count];
  }
  async getResearchStudyById(id) {
    const { data } = await get(`${TCGA_URL}/api/researchstudy/${id}`);
    return data;
  }

  async getAllPatients({ _page, _count, _sort, _offset } = {}) {
    const { data } = await get(`${TCGA_URL}/api/patient`, {
      params: { _page, _count, _offset, _sort },
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
