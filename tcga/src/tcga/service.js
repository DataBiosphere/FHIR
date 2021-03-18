const { dedupeObjects, transformGdcResults, buildOrderBy } = require('../utils');
const { BigQuery } = require('../services');
const ObservationQueryBuilder = require('../services/ObservationQueryBuilder');
const DiagnosticReportQueryBuilder = require('../services/DiagnosticReportQueryBuilder');
const ResearchStudyQueryBuilder = require('../services/ResearchStudyQueryBuilder');
const SpecimenQueryBuilder = require('../services/SpecimenQueryBuilder');
const PatientQueryBuilder = require('../services/PatientQueryBuilder');
const Translator = require('../services/translator');

const resourceTranslator = new Translator();

const diagnosticReportQueryBuilder = new DiagnosticReportQueryBuilder({
  fieldResolver: resourceTranslator.diagnosticReportFieldResolver,
  valueResolver: resourceTranslator.diagnosticReportValueResolver
});

const observationQueryBuilder = new ObservationQueryBuilder({
  fieldResolver: resourceTranslator.observationFieldResolver,
  valueResolver: resourceTranslator.observationValueResolver
});

const researchStudyQueryBuilder = new ResearchStudyQueryBuilder({
  fieldResolver: resourceTranslator.researchStudyFieldResolver,
  valueResolver: resourceTranslator.researchStudyValueResolver
});

const specimenQueryBuilder = new SpecimenQueryBuilder({
  fieldResolver: resourceTranslator.specimenFieldResolver,
  valueResolver: resourceTranslator.specimenValueResolver
});

const patientQueryBuilder = new PatientQueryBuilder({
  fieldResolver: resourceTranslator.patientFieldResolver,
  valueResolver: resourceTranslator.patientValueResolver
});

/**
 * Convert a BigQuery results set to an organized model by caseID -> diagnoses|biospecimens
 * @param {array} rows
 */
const transformGdcRows = (rows) => {
  const caseIdMappings = rows.map(transformGdcResults).reduce((accum, ele) => {
    if (!accum[ele.case_id]) {
      accum[ele.case_id] = ele;
    } else {
      const { diagnoses, biospecimen } = ele;
      const { diagnoses: caseDiagnoses, biospecimen: caseBiospecimen } = accum[ele.case_id];
      accum[ele.case_id].diagnoses = dedupeObjects(diagnoses.concat(caseDiagnoses));
      accum[ele.case_id].biospecimen = dedupeObjects(biospecimen.concat(caseBiospecimen));
    }
    return accum;
  }, {});
  return Object.keys(caseIdMappings).map((caseId) => {
    const entry = caseIdMappings[caseId];
    return resourceTranslator.toDiagnosticReport({
      ...entry.current,
      diagnoses: entry.diagnoses,
      biospecimen: entry.biospecimen,
    });
  });
};

/**
 * getAll Diagnostic Report data by _page and _count
 * @param {string=} _page
 * @param {string=} _count
 */
const getAllDiagnosticReports = async ({
  _id = '',
  _page = 1,
  _count = 20,
  _sort = '',
  _offset = 0,
  _search = {}
} = {}) => {
  const [rows, count] = await diagnosticReportQueryBuilder.get({
    _id,
    _page,
    _count,
    _sort,
    _offset,
    _search
  });

  return [transformGdcRows(rows), count];
};

/**
 * Get Diagnostic Report data by an ID
 * @param {string} id
 */
const getDiagnosticReportById = async (id) => {
  const [rows] = await diagnosticReportQueryBuilder.getById(id);

  return rows && rows.length ? transformGdcRows(rows)[0] : null;
};

/**
 * getAll Observation data by _page and _count
 * @param {string=} _page
 * @param {string=} _count
 */
const getAllObservations = async ({ _id = '', _page = 1, _count = 20, _sort = '', _offset = 0, _search = {} } = {}) => {
  const [rows, count] = await observationQueryBuilder.get({
    _id,
    _page,
    _count,
    _sort,
    _offset,
    _search
  });

  return [rows.map((row) => resourceTranslator.toObservation(row)), count];
};

/**
 * Get Observation data by an ID
 * @param {string} id
 */
const getObservationById = async (id) => {
  const [rows] = await observationQueryBuilder.getById(id);

  return rows && rows.length ? resourceTranslator.toObservation(rows[0]) : null;
};

/**
 * getAll Specimen data by _page and _count
 * @param {string=} _page
 * @param {string=} _count
 */
const getAllSpecimen = async ({ _id = '', _page = 1, _count = 20, _sort = '', _offset = 0, _search = {} } = {}) => {
  const [rows, count] = await specimenQueryBuilder.get({
    _id,
    _page,
    _count,
    _sort,
    _offset,
    _search
  });

  return [rows.map((row) => resourceTranslator.toSpecimen(row)), count];
};

/**
 * Get Specimen data by an ID
 * @param {string} id
 */
const getSpecimenById = async (id) => {
  const [rows] = await specimenQueryBuilder.getById(id);

  return rows && rows.length ? resourceTranslator.toSpecimen(rows[0]) : null;
};

/**
 * getAll Research Study data by _page and _count
 * @param {number=} [_page]
 * @param {number=} [_count]
 * @param {string=} [_sort]
 * @param {number=} [_offset]
 */
const getAllResearchStudies = async ({ _id = '', _page = 1, _count = 20, _sort = '', _offset = 0, _search = {} } = {}) => {
  const [rows, count] = await researchStudyQueryBuilder.get({
    _id,
    _page,
    _count,
    _sort,
    _offset,
    _search
  });

  return [rows.map((row) => resourceTranslator.toResearchStudy(row)), count];
};

/**
 * Get Research Study data by an ID
 * @param {string} id
 */
const getResearchStudyById = async (id) => {
  const [rows] = await researchStudyQueryBuilder.get(id);

  return rows && rows.length ? resourceTranslator.toResearchStudy(rows[0]) : null;
};

/**
 * getAll Patient data by _page and _count
 * @param {number=} [_page]
 * @param {number=} [_count]
 * @param {string=} [_sort]
 * @param {number=} [_offset]
 */
const getAllPatients = async ({ _id = '', _page = 1, _count = 20, _sort = '', _offset = 0, _search = {} } = {}) => {
  const [rows, count] = await patientQueryBuilder.get({
    _id,
    _page,
    _count,
    _sort,
    _offset,
    _search
  });

  return [rows.map((row) => resourceTranslator.toPatient(row)), count];
};

/**
 * Get Project data by an ID
 * @param {string} id
 */
const getPatientById = async (id) => {
  const [rows] = await patientQueryBuilder.getById(id);

  return rows && rows.length ? resourceTranslator.toPatient(rows[0]) : null;
};

module.exports = {
  getAllDiagnosticReports,
  getDiagnosticReportById,
  getAllObservations,
  getObservationById,
  getAllSpecimen,
  getSpecimenById,
  getAllResearchStudies,
  getResearchStudyById,
  getAllPatients,
  getPatientById,
};
