const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/workspace', controller.getAllWorkspaces);

router.get('/workspace/:id', controller.getWorkspaceById);

router.get('/sample', controller.getAllSamples);
router.get('/workspace/:workspace/sample', controller.getAllSamples);

router.get('/sample/:id', controller.getSampleById);
router.get('/workspace/:workspace/sample/:id', controller.getSampleById);

router.get('/subject', controller.getAllSubjects);
router.get('/workspace/:workspace/subject', controller.getAllSubjects);

router.get('/subject/:id', controller.getSubjectById);
router.get('/workspace/:workspace/subject/:id', controller.getSubjectById);

router.get('/observation', controller.getAllObservations);
router.get('/workspace/:workspace/observation', controller.getAllObservations);

router.get('/observation/:id', controller.getObservationById);
router.get('/workspace/:workspace/observation/:id', controller.getObservationById);

module.exports = router;
