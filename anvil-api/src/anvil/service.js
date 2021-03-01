const { AnvilMongo } = require('../services');
const { buildSortObject } = require('../utils');

const WorkspaceService = new AnvilMongo({ collectionName: 'workspace' });
const SampleService = new AnvilMongo({ collectionName: 'sample' });
const SubjectService = new AnvilMongo({ collectionName: 'subject' });

/**
 * getAll Workspace data by page and pageSize
 *
 * @param {string} page
 * @param {string} pageSize
 */
const getAllWorkspaces = async ({ page = 1, pageSize = 25, sort = '', offset = 0 }) => {
  const [sortObj, existsObj] = buildSortObject(sort);

  const [results, count] = await WorkspaceService.find({
    page: page,
    pageSize: pageSize,
    query: { ...existsObj },
    projection: {},
    offset: offset,
    sort: sortObj,
  });

  return [results, count];
};
const getWorkspaceById = async (id) => {
  const result = await WorkspaceService.findOne({
    query: { name: id },
  });

  return result || null;
};

const getAllSamples = async ({ workspace = '', page = 1, pageSize = 25 }) => {
  let [results, count] = await SampleService.find({
    page: page,
    pageSize: pageSize,
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

const getAllSubjects = async ({ workspace = '', page = 1, pageSize = 25 }) => {
  let [results, count] = await SubjectService.find({
    page: page,
    pageSize: pageSize,
    query: { workspaceName: { $regex: workspace } },
    projection: {},
  });

  return [results, count];
};
const getSubjectById = async ({ workspace = '', id }) => {
  const result = await SubjectService.findOne({
    query: {
      $and: [{ workspaceName: { $regex: workspace } }, { id: id }],
    },
  });

  return result || null;
};

const getAllObservations = async ({ workspace = '', page = 1, pageSize = 25 }) => {
  let [results, count] = await SubjectService.find({
    page: page,
    pageSize: pageSize,
    query: {
      $and: [
        { workspaceName: { $regex: workspace } },
        { diseases: { $exists: true } },
        { diseases: { $size: 1 } },
      ],
    },
    projection: {},
  });

  return [results, count];
};
const getObservationById = async (id) => {
  const result = await SubjectService.findOne({
    query: {
      $and: [
        { workspaceName: { $regex: workspace } },
        { id: id },
        { diseases: { $exists: true } },
        { diseases: { $size: 1 } },
      ],
    },
  });

  return result || null;
};

module.exports = {
  getAllWorkspaces,
  getWorkspaceById,
  getAllSamples,
  getSampleById,
  getAllSubjects,
  getSubjectById,
  getAllObservations,
  getObservationById,
};
