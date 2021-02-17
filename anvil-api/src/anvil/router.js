const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/workspace', controller.getAllWorkspaces);

router.get('/workspace/:id', controller.getWorkspaceById);

router.get('/sample', controller.getAllSamples);
router.get('/workspace/:workspace/sample', controller.getAllSamples);

router.get('/sample/:id', controller.getSampleById);
router.get('/workspace/:workspace/sample/:id', controller.getSampleByWorkspaceId);

router.get('/subject', controller.getAllSubjects);
router.get('/workspace/:workspace/subject', controller.getAllSubjects);

router.get('/subject/:id', controller.getSubjectById);
router.get('/workspace/:workspace/subject/:id', controller.getSubjectByWorkspaceId);

module.exports = router;
