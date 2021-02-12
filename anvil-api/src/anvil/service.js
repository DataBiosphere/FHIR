const { AnvilMongo } = require('../services');

const WorkspaceService = new AnvilMongo({ collectionName: 'workspace' });

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
  const [rows] = await WorkspaceService.find({
    query: { name: id },
  });

  if (rows && rows.length) {
    return rows;
  }
  return null;
};

module.exports = {
  getAllWorkspaces,
  getWorkspaceById,
};
