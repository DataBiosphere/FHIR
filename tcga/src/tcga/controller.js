const logger = require('../logger');
const service = require('./service');

const getAllGdc = async (req, res) => {
  logger.info('TCGA >>> getAllGdc');
  const { page, pageSize } = req.query;
  const [results, count] = await service.getAllGdc({ page, pageSize });
  res.json({
    results,
    count,
  });
};

const getGdcById = async (req, res) => {
  logger.info('TCGA >>> getGdcById');
  const { id } = req.params;
  const results = await service.getGdcById(id);
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
};

const getAllDiagnosis = async (req, res) => {
  logger.info('TCGA >>> getAllDiagnosis');
  const { page, pageSize } = req.query;
  const [results, count] = await service.getAllDiagnosis({ page, pageSize });
  res.json({
    results,
    count,
  });
};

const getDiagnosisById = async (req, res) => {
  logger.info('TCGA >>> getDiagnosisById');
  const { id } = req.params;
  const results = await service.getDiagnosisById(id);
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
};

const getAllBiospecimen = async (req, res) => {
  logger.info('TCGA >>> getAllBiospecimen');
  const { page, pageSize } = req.query;
  const [results, count] = await service.getAllBiospecimen({ page, pageSize });
  res.json({
    results,
    count,
  });
};

const getBiospecimenById = async (req, res) => {
  logger.info('TCGA >>> getBiospecimenById');
  const { id } = req.params;
  const results = await service.getBiospecimenById(id);
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
};

module.exports = {
  getAllGdc,
  getGdcById,
  getAllDiagnosis,
  getDiagnosisById,
  getAllBiospecimen,
  getBiospecimenById,
};
