const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/gdc', controller.getAllGdc);

router.get('/gdc/:id', controller.getByGdcById);

router.get('/diagnosis', controller.getAllDiagnosis);

router.get('/diagnosis/:id', controller.getByDiagnosisById);

module.exports = router;
