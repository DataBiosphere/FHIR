const logger = require('../logger');
const service = require('./service');
const { getSearchParameters } = require('../utils/searching');

const getAllDiagnosticReports = async (req, res) => {
  logger.info('TCGA >>> getAllDiagnosticReports');
  const { _id, _page, _count, _sort, _offset } = req.query;
  const searchFields = getSearchParameters(req.query);

  const [results, count] = await service.getAllDiagnosticReports({ _id, _page, _count, _sort, _offset, _search: searchFields });
  res.json({
    results,
    count,
  });
};
const getDiagnosticReportById = async (req, res) => {
  logger.info('TCGA >>> getDiagnosticReportById');
  const { id } = req.params;
  const results = await service.getDiagnosticReportById(id);
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
};

const getAllObservations = async (req, res) => {
  logger.info('TCGA >>> getAllObservations');
  const { _id, _page, _count, _offset, _sort } = req.query;
  const searchFields = getSearchParameters(req.query);

  const [results, count] = await service.getAllObservations({ _id, _page, _count, _sort, _offset, _search: searchFields });
  res.json({
    results,
    count,
  });
};
const getObservationById = async (req, res) => {
  logger.info('TCGA >>> getObservationById');
  const { id } = req.params;
  const results = await service.getObservationById(id);
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
};

const getAllSpecimen = async (req, res) => {
  logger.info('TCGA >>> getAllSpecimen');
  const { _id, _page, _count, _sort, _offset } = req.query;
  const searchFields = getSearchParameters(req.query);

  const [results, count] = await service.getAllSpecimen({ _id, _page, _count, _sort, _offset, _search: searchFields });
  res.json({
    results,
    count,
  });
};
const getSpecimenById = async (req, res) => {
  logger.info('TCGA >>> getSpecimenById');
  const { id } = req.params;
  const results = await service.getSpecimenById(id);
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
};

const getAllResearchStudies = async (req, res) => {
  logger.info('TCGA >>> getAllResearchStudies');
  const { _id, _page, _count, _sort, _offset } = req.query;
  const searchFields = getSearchParameters(req.query);

  const [results, count] = await service.getAllResearchStudies({ _id, _page, _count, _sort, _offset, _search: searchFields });
  res.json({
    results,
    count,
  });
};
const getResearchStudyById = async (req, res) => {
  logger.info('TCGA >>> getResearchStudyById');
  const { id } = req.params;
  const results = await service.getResearchStudyById(id);
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
};

const getAllPatients = async (req, res) => {
  logger.info('TCGA >>> getAllPatients');
  const { _id, _page, _count, _sort, _offset } = req.query;
  const searchFields = getSearchParameters(req.query);

  const [results, count] = await service.getAllPatients({ _id, _page, _count, _sort, _offset, _search: searchFields });
  res.json({
    results,
    count,
  });
};
const getPatientById = async (req, res) => {
  logger.info('TCGA >>> getPatientById');
  const { id } = req.params;
  const results = await service.getPatientById(id);
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
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
