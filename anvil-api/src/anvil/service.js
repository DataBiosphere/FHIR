const { AnvilMongo } = require('../services');

const WorkspaceService = new AnvilMongo({ collectionName: 'Workspace' });

/**
 * getAll Workspace data by page and pageSize
 *
 * @param {string} page
 * @param {string} pageSize
 */
const getAllWorkspaces = async ({ page, pageSize } = { page: 1, pageSize: 20 }) => {
  const [results, count] = await WorkspaceService.find({ 
      page: page, 
      pageSize: pageSize, 
      query: {}
    });

  return [results, count];
};

module.exports = {
    getAllWorkspaces
}