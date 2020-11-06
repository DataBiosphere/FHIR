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

const getByGdcById = async (req, res) => {
  logger.info('TCGA >>> getByGdcById');
  const { id } = req.params;
  const results = await service.getByGdcById(id);
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

const getByDiagnosisById = async (req, res) => {
  logger.info('TCGA >>> getByDiagnosisById');
  const { id } = req.params;
  const results = await service.getByDiagnosisById(id);
  if (!results) {
    res.sendStatus(404);
  } else {
    res.json(results);
  }
};

module.exports = {
  getAllGdc,
  getByGdcById,
  getAllDiagnosis,
  getByDiagnosisById,
};
