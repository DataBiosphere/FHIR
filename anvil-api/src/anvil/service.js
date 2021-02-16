const e = require('express');
const { ObjectID } = require('mongodb');
const logger = require('../logger');
const { AnvilMongo } = require('../services');

const WorkspaceService = new AnvilMongo({ collectionName: 'workspace' });
const SampleService = new AnvilMongo({ collectionName: 'sample' });
const SubjectService = new AnvilMongo({ collectionName: 'subject' });

/**
 * getAll Workspace data by page and pageSize
 *
 * @param {string} page
 * @param {string} pageSize
 */
const getAllWorkspaces = async ({ page = 1, pageSize = 25 }) => {
  const [results, count] = await WorkspaceService.find({
    page: page,
    pageSize: pageSize,
    query: {},
    projection: {},
  });

  return [results, count];
};

const getWorkspaceById = async (id) => {
  const result = await WorkspaceService.findOne({
    query: { name: id },
  });

  if (result) {
    return result;
  }
  return null;
};

const getAllSamples = async ({ workspace = '', page = 1, pageSize = 25 }) => {
  let [results, count] = await SampleService.find({
    page: page,
    pageSize: pageSize,
    query: { id: { $regex: workspace } },
    projection: {},
  });

  return [results, count];
};

const getSampleById = async (id) => {
  const result = await SampleService.findOne({
    query: { _id: ObjectID(id) },
  });

  if (result) {
    return result;
  }
  return null;
};

const getSampleByWorkspaceId = async (id) => {
  const result = await SampleService.findOne({
    query: { id: id },
  });

  if (result) {
    return result;
  }
  return null;
};

const getAllSubjects = async ({ workspace = '', page = 1, pageSize = 25 }) => {
  let [results, count] = await SubjectService.find({
    page: page,
    pageSize: pageSize,
    query: { id: { $regex: workspace } },
    projection: {},
  });

  return [results, count];
};

const getSubjectById = async (id) => {
  const result = await SubjectService.findOne({
    query: { _id: ObjectID(id) },
  });

  if (result) {
    return result;
  }
  return null;
};

const getSubjectByWorkspaceId = async (id) => {
  const result = await SubjectService.findOne({
    query: { id: id },
  });

  if (result) {
    return result;
  }
  return null;
};

module.exports = {
  getAllWorkspaces,
  getWorkspaceById,
  getAllSamples,
  getSampleById,
  getSampleByWorkspaceId,
  getAllSubjects,
  getSubjectById,
  getSubjectByWorkspaceId,
};
