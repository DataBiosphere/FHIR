const { AnvilMongo } = require('../services');

const WorkspaceService = new AnvilMongo({ collectionName: 'Workspace' });

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
    projection: { 'subjects.samples': 0 },
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

module.exports = {
  getAllWorkspaces,
  getWorkspaceById,
};
