const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/gdc', controller.getAllGdc);

router.get('/gdc/:id', controller.getGdcById);

router.get('/diagnosis', controller.getAllDiagnosis);

router.get('/diagnosis/:id', controller.getDiagnosisById);

module.exports = router;
