const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/', controller.getAll);

router.get('/:id', controller.getById);

module.exports = router;
