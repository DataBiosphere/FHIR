const logger = require('../logger');
const service = require('./service');

const getAllResearchStudies = async (req, res) => {
  logger.info('ANVIL >>> getAllResearchStudies');
  const { _page, _count, _sort, _offset } = req.query;
  const [results, count] = await service.getAllResearchStudies({ _page, _count, _sort, _offset });
  res.json({
    results,
    count,
  });
};
const getResearchStudyById = async (req, res) => {
  logger.info('ANVIL >>> getResearchStudyById');
  const { id } = req.params;
  const results = await service.getResearchStudyById(id);
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

  const { _page, _count } = req.query;
  const [results, count] = await service.getAllSamples({ workspace, _page, _count });
  res.json({
    results,
    count,
  });
};
const getSampleById = async (req, res) => {
  logger.info('ANVIL >>> getSampleById');
  const { workspace, id } = req.params;
  const results = await service.getSampleById({ workspace, id });
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
};

const getAllPatients = async (req, res) => {
  logger.info('ANVIL >>> getAllPatients');
  let workspace;
  if (req.params) {
    workspace = req.params.workspace;
  }

  const { _page, _count, _sort, _offset } = req.query;
  const [results, count] = await service.getAllPatients({
    workspace,
    _page,
    _count,
    _sort,
    _offset,
  });
  res.json({
    results,
    count,
  });
};
const getPatientById = async (req, res) => {
  logger.info('ANVIL >>> getPatientById');
  const { workspace, id } = req.params;
  const results = await service.getPatientById({ workspace, id });
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
};

const getAllObservations = async (req, res) => {
  logger.info('ANVIL >>> getAllObservations');
  let workspace;
  if (req.params) {
    workspace = req.params.workspace;
  }

  const { _page, _count, _sort, _offset } = req.query;
  const [results, count] = await service.getAllObservations({
    workspace,
    _page,
    _count,
    _sort,
    _offset,
  });
  res.json({
    results,
    count,
  });
};
const getObservationById = async (req, res) => {
  logger.info('ANVIL >>> getObservationById');
  const { workspace, id } = req.params;
  const results = await service.getObservationById({ workspace, id });
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
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
