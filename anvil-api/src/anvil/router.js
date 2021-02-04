const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/workspace', controller.getAllWorkspaces);

module.exports = router;
