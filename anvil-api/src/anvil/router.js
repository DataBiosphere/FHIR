const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/researchstudy', controller.getAllResearchStudies);

router.get('/researchstudy/:id', controller.getResearchStudyById);

router.get('/sample', controller.getAllSamples);

router.get('/sample/:id', controller.getSampleById);

router.get('/patient', controller.getAllPatients);

router.get('/patient/:id', controller.getPatientById);

router.get('/observation', controller.getAllObservations);

router.get('/observation/:id', controller.getObservationById);

module.exports = router;
