const axios = require('axios');
const memoize = require('fast-memoize');
const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const { createCache } = require('../utils');

const DiagnosticReport = resolveSchema('4_0_0', 'DiagnosticReport');
const Observation = resolveSchema('4_0_0', 'Observation');

const { TCGA_URL, TCGA_CACHE_TTL } = process.env;

const ONE_SECOND = 1;

const ONE_MINUTE = ONE_SECOND * 60;

const CACHE_TTL = (TCGA_CACHE_TTL || ONE_MINUTE) * 1000;

/**
 * Translate a TCGA Diagnosis response to an Observation
 *
 * @param {object} diagnosis
 */
const translateDiagnosisToObservation = (diagnosis, gdcResult) => {
  return new Observation({
    resourceType: 'Observation',
    id: diagnosis.diag__treat__treatment_id,
    text: {
      status: 'generated',
      div: `<div xmlns="http://www.w3.org/1999/xhtml">${diagnosis.diag__treat__treatment_type}</div>`,
    },
    meta: {
      versionId: diagnosis.diag__treat__treatment_id,
      source: gdcResult.proj__project_id,
      profile: ['https://www.hl7.org/fhir/observation.html'],
    },
    issued: gdcResult.diag__treat__updated_datetime,
    effectiveDateTime: gdcResult.diag__treat__updated_datetime,
    status: 'final',
  });
};

/**
 * Convert a single TCGA Result to a DiagnosticResource
 *
 * @param {object} tcgaResult
 */
const translateSingleGdcResultsToFhir = (tcgaResult) => {
  const diagnosticReport = new DiagnosticReport({
    resourceType: 'DiagnosticReport',
    id: tcgaResult.case_id,
    meta: {
      versionId: tcgaResult.case_id,
      source: tcgaResult.proj__project_id,
      profile: 'https://www.hl7.org/fhir/diagnosticreport-genetics.html',
    },
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
            code: 'GE',
            display: 'Genetics',
          },
        ],
      },
    ],
    subject: {
      reference: `Patient/${tcgaResult.demo__demographic_id}`,
    },
    result: tcgaResult.diagnoses.map((diagnosis) => {
      return {
        reference: `Observation/${diagnosis.diag__treat__treatment_id}`,
        display: diagnosis.diag__treat__treatment_type,
      };
    }),

    issued: tcgaResult.updated_datetime,
    effectiveDatetime: tcgaResult.updated_datetime,
    extension: [
      {
        url: 'https://build.fhir.org/extension-workflow-researchstudy.html',
        valueReference: {
          reference: 'ResearchStudy/TCGA',
          type: 'ResearchStudy',
        },
      },
    ],
  });

  const observations = tcgaResult.diagnoses.map((diagnosis) =>
    translateDiagnosisToObservation(diagnosis, tcgaResult)
  );

  return { diagnosticReport, observations };
};

/**
 * Convert a list of TCGA Results to DiagnosticReports
 *
 * @param {array} tcgaResults
 */
const translateGdcResultsToFhir = (tcgaResults) => {
  return tcgaResults.map(translateSingleGdcResultsToFhir);
};

const get = memoize(axios.get, {
  cache: createCache(CACHE_TTL),
});

class TCGA {
  async getAllDiagnosticReports({ page, pageSize } = {}) {
    const { data } = await get(`${TCGA_URL}/api/gdc`, { params: { page, pageSize } });
    const { results, count } = data;
    return [translateGdcResultsToFhir(results), count];
  }

  async getDiagnosticReportById(id) {
    const { data } = await get(`${TCGA_URL}/api/gdc/${id}`);
    return translateSingleGdcResultsToFhir(data);
  }

  async getAllDiagnoses({ page, pageSize } = {}) {
    const { data } = await get(`${TCGA_URL}/api/diagnosis`, { params: { page, pageSize } });
    const { results, count } = data;
    return [
      results.map((diagnosis) => translateDiagnosisToObservation(diagnosis, diagnosis)),
      count,
    ];
  }

  async getDiagnosisById(id) {
    const { data } = await get(`${TCGA_URL}/api/diagnosis/${id}`);
    return translateDiagnosisToObservation(data, data);
  }
}

module.exports = TCGA;
