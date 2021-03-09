const { AnvilMongo } = require('../services');
const { buildSortObject } = require('../utils');
const Translator = require('../services/translator');

const WorkspaceService = new AnvilMongo({ collectionName: 'workspace' });
const SampleService = new AnvilMongo({ collectionName: 'sample' });
const SubjectService = new AnvilMongo({ collectionName: 'subject' });
const resourceTranslator = new Translator();

/**
 * getAll Research Study data by page and _count
 *
 * @param {string} _page
 * @param {string} _count
 */
const getAllResearchStudies = async ({ _page = 1, _count = 25, _sort = '', _offset = 0 }) => {
  const [sortObj, existsObj] = resourceTranslator.toResearchStudySortParams(_sort);

  const [results, count] = await WorkspaceService.find({
    page: _page,
    size: _count,
    query: { },
    projection: {},
    offset: _offset,
    sort: sortObj,
  });

  return [results.map((result) => resourceTranslator.toResearchStudy(result)), count];
};
const getResearchStudyById = async (id) => {
  const result = await WorkspaceService.findOne({
    query: { name: id },
  });

  return resourceTranslator.toResearchStudy(result) || null;
};

const getAllSamples = async ({ workspace = '', _page = 1, _count = 25 }) => {
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
  workspace = '',
  _page = 1,
  _count = 25,
  _sort = '',
  _offset = 0,
}) => {
  const [sortObj, existObj] = resourceTranslator.toPatientSortParams(_sort);

  // in case no _sort is provided
  const query = existObj
    ? { $and: [{ workspaceName: { $regex: workspace } }, existObj] }
    : { workspaceName: { $regex: workspace } };

  const [results, count] = await SubjectService.find({
    page: _page,
    size: _count,
    query: query,
    projection: {},
    offset: _offset,
    sort: sortObj,
  });

  return [results.map((result) => resourceTranslator.toPatient(result)), count];
};
const getPatientById = async ({ workspace = '', id }) => {
  const result = await SubjectService.findOne({
    query: {
      $and: [{ workspaceName: { $regex: workspace } }, { id: id }],
    },
  });

  return resourceTranslator.toPatient(result) || null;
};

const getAllObservations = async ({
  workspace = '',
  _page = 1,
  _count = 25,
  _sort = '',
  _offset = 0,
}) => {
  // TODO: need to rework this existsObj
  const [sortObj, existObj] = resourceTranslator.toPatientSortParams(_sort);

  // in case no _sort is provided
  const query = existObj
    ? {
        $and: [
          { workspaceName: { $regex: workspace } },
          { diseases: { $ne: null } },
          { $where: 'this.diseases.length > 0 && this.diseases[0] != null' },
          existObj,
        ],
      }
    : {
        $and: [
          { workspaceName: { $regex: workspace } },
          { diseases: { $ne: null } },
          { $where: 'this.diseases.length > 0 && this.diseases[0] != null' },
        ],
      };

  const [results, count] = await SubjectService.find({
    page: _page,
    size: _count,
    query: query,
    projection: {},
    offset: _offset,
    sort: sortObj,
  });

  return [results.map((result) => resourceTranslator.toObservation(result)), count];
};
const getObservationById = async ({ workspace = '', id }) => {
  const result = await SubjectService.findOne({
    query: {
      $and: [
        { workspaceName: { $regex: workspace } },
        { id: id },
        { diseases: { $ne: null } },
        { $where: 'this.diseases.length > 0 && this.diseases[0] != null' },
      ],
    },
  });

  return resourceTranslator.toObservation(result) || null;
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
