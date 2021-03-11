const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/diagnosticreport', controller.getAllDiagnosticReports);
router.get('/diagnosticreport/:id', controller.getDiagnosticReportById);

router.get('/observation', controller.getAllObservations);
router.get('/observation/:id', controller.getObservationById);

router.get('/specimen', controller.getAllSpecimen);
router.get('/specimen/:id', controller.getSpecimenById);

router.get('/researchstudy', controller.getAllResearchStudies);
router.get('/researchstudy/:id', controller.getResearchStudyById);

router.get('/patient', controller.getAllPatients);
router.get('/patient/:id', controller.getPatientById);

module.exports = router;
