const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/researchstudy', controller.getAllResearchStudies);

router.get('/researchstudy/:id', controller.getResearchStudyById);

router.get('/sample', controller.getAllSamples);
router.get('/workspace/:workspace/sample', controller.getAllSamples);

router.get('/sample/:id', controller.getSampleById);
router.get('/workspace/:workspace/sample/:id', controller.getSampleById);

router.get('/patient', controller.getAllPatients);
router.get('/workspace/:workspace/subject', controller.getAllPatients);

router.get('/patient/:id', controller.getPatientById);
router.get('/workspace/:workspace/subject/:id', controller.getPatientById);

router.get('/observation', controller.getAllObservations);
router.get('/workspace/:workspace/observation', controller.getAllObservations);

router.get('/observation/:id', controller.getObservationById);
router.get('/workspace/:workspace/observation/:id', controller.getObservationById);

module.exports = router;
