const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/workspace', controller.getAllWorkspaces);

router.get('/workspace/:id', controller.getWorkspaceById);

router.get('/sample/:workspace*?', controller.getAllSamples);
router.get('/workspace/:workspace/sample', controller.getAllSamples);

router.get('/workspace/:workspace/sample/:id', controller.getSampleById);

router.get('/subject/:workspace*?', controller.getAllSubjects);
router.get('/workspace/:workspace/subject', controller.getAllSubjects);

router.get('/workspace/:workspace/subject/:id', controller.getSubjectById);

module.exports = router;
