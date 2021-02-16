const logger = require('../logger');
const service = require('./service');

const getAllWorkspaces = async (req, res) => {
  logger.info('ANVIL >>> getAllWorkspaces');
  const { page, pageSize } = req.query;
  const [results, count] = await service.getAllWorkspaces({ page, pageSize });
  res.json({
    results,
    count,
  });
};

const getWorkspaceById = async (req, res) => {
  logger.info('ANVIL >>> getWorkspaceById');
  const { id } = req.params;
  const results = await service.getWorkspaceById(id);
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
};

const getAllSamples = async (req, res) => {
  logger.info('ANVIL >>> getAllSamples');
  let workspace;
  if (req.params) {
    workspace = req.params.workspace;
  }

  const { page, pageSize } = req.query;
  const [results, count] = await service.getAllSamples({ workspace, page, pageSize });
  res.json({
    results,
    count,
  });
};

const getSampleById = async (req, res) => {
  logger.info('ANVIL >>> getSampleById');
  const { workspace, id } = req.params;
  const sampleId = `${workspace}/Sa/${id}`;
  const results = await service.getSampleById(sampleId);
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
};

const getAllSubjects = async (req, res) => {
  logger.info('ANVIL >>> getAllSubjects');
  let workspace;
  if (req.params) {
    workspace = req.params.workspace;
  }

  const { page, pageSize } = req.query;
  const [results, count] = await service.getAllSubjects({ workspace, page, pageSize });
  res.json({
    results,
    count,
  });
};

const getSubjectById = async (req, res) => {
  logger.info('ANVIL >>> getSubjectById');
  const { workspace, id } = req.params;
  const subjectId = `${workspace}/Su/${id}`;
  const results = await service.getSubjectById(subjectId);
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
};

module.exports = {
  getAllWorkspaces,
  getWorkspaceById,
  getAllSamples,
  getSampleById,
  getAllSubjects,
  getSubjectById,
};
