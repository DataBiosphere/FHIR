const express = require('express');
const controller = require('./controller');

const router = express.Router();

/**
 * @swagger
 *
 * /gdc:
 *   get:
 *     summary: Get results from GDC Current
 *     produces:
 *       - application/json
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *           type: number
 *        required: false
 *        description: The page of results you want
 *      - in: query
 *        name: pageSize
 *        schema:
 *           type: number
 *        required: false
 *        description: The amount of results you want
 *     responses:
 *       200:
 *         description: Results from GDC Current and their related diagnoses and biospecimens
 */
router.get('/gdc', controller.getAllGdc);

/**
 * @swagger
 *
 * /gdc/{id}:
 *   get:
 *     summary: Get one result from GDC Current
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *           type: string
 *        required: true
 *        description: Unique identifier of the GDC record
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A single result from GDC Current
 *       404:
 *         description: Not found
 */
router.get('/gdc/:id', controller.getGdcById);

/* @swagger
 *
 * /diagnosis:
 *   get:
 *     description: Get results from the TCGA Diagnosis data
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get results from the TCGA Diagnosis data
 */
router.get('/diagnosis', controller.getAllDiagnosis);

router.get('/diagnosis/:id', controller.getDiagnosisById);

module.exports = router;
