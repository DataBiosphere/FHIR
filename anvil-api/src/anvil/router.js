const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/Workspace', controller.getAllWorkspaces);

router.get('/Workspace/:id', controller.getWorkspaceById);

router.get('/Sample', controller.getAllSamples);

router.get('/Sample/:id', controller.getSampleById);

module.exports = router;
