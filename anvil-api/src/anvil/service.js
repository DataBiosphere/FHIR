const { AnvilMongo } = require('../services');
const { buildSortObject } = require('../utils');
const Translator = require('../services/translator');

const WorkspaceService = new AnvilMongo({ collectionName: 'workspace' });
const SampleService = new AnvilMongo({ collectionName: 'sample' });
const SubjectService = new AnvilMongo({ collectionName: 'subject' });
const resourceTranslator = new Translator();

const ObservationQueryBuilder = require('../services/ObservationQueryBuilder');
const ResearchStudyQueryBuilder = require('../services/ResearchStudyQueryBuilder');
const PatientQueryBuilder = require('../services/PatientQueryBuilder');

const observationQueryBuilder = new ObservationQueryBuilder({
  fieldResolver: resourceTranslator.observationFieldResolver,
  valueResolver: resourceTranslator.observationValueResolver
});

const researchStudyQueryBuilder = new ResearchStudyQueryBuilder({
  fieldResolver: resourceTranslator.researchStudyFieldResolver,
  valueResolver: resourceTranslator.researchStudyValueResolver
});

const patientQueryBuilder = new PatientQueryBuilder({
  fieldResolver: resourceTranslator.patientFieldResolver,
  valueResolver: resourceTranslator.patientValueResolver
});

/**
 * getAll Research Study data by page and _count
 *
 * @param {string} _page
 * @param {string} _count
 */
const getAllResearchStudies = async ({ _id = '', _page = 1, _count = 25, _sort = '', _offset = 0, _search = {} }) => {
  const [results, count] = await researchStudyQueryBuilder.find({
    _id,
    _page,
    _count,
    _offset,
    _sort,
    _search
  });

  return [results.map((result) => resourceTranslator.toResearchStudy(result)), count];
};
const getResearchStudyById = async (id) => {
  const result = await researchStudyQueryBuilder.findById(id);

  return result ? resourceTranslator.toResearchStudy(result) : null;
};

const getAllSamples = async ({ _id = '', workspace = '', _page = 1, _count = 25, _search = {} }) => {
  let [results, count] = await SampleService.find({
    page: _page,
    size: _count,
    query: { workspaceName: { $regex: workspace } },
    projection: {},
  });

  return [results, count];
};
const getSampleById = async ({ workspace = '', id }) => {
  const result = await SampleService.findOne({
    query: {
      $and: [{ workspaceName: { $regex: workspace } }, { id: id }],
    },
  });

  return result || null;
};

const getAllPatients = async ({
  _id = '',
  _page = 1,
  _count = 25,
  _sort = '',
  _offset = 0,
  _search = {}
}) => {
  const [results, count] = await patientQueryBuilder.find({
    _id,
    _page,
    _count,
    _offset,
    _sort,
    _search
  });

  return [results.map((result) => resourceTranslator.toPatient(result)), count];
};
const getPatientById = async ({ id }) => {
  const result = await patientQueryBuilder.findById(id);

  return result ? resourceTranslator.toPatient(result) : null;
};

const getAllObservations = async ({
  _id = '',
  workspace = '',
  _page = 1,
  _count = 25,
  _sort = '',
  _offset = 0,
  _search = {}
}) => {
  const [results, count] = await observationQueryBuilder.find({
    _id,
    _page,
    _count,
    _offset,
    _sort,
    _search
  });

  return [results.map((result) => resourceTranslator.toObservation(result)), count];
};
const getObservationById = async ({ id }) => {
  const result = await observationQueryBuilder.findById(id);

  return result ? resourceTranslator.toObservation(result) : null;
};

module.exports = {
  getAllResearchStudies,
  getResearchStudyById,
  getAllSamples,
  getSampleById,
  getAllPatients,
  getPatientById,
  getAllObservations,
  getObservationById,
};
