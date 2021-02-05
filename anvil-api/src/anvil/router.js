const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/Workspace', controller.getAllWorkspaces);

module.exports = router;
