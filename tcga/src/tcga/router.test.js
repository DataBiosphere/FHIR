jest.mock('./controller', () => ({
  getAllDiagnosticReports: jest.fn().mockImplementation((req, res) => res.json({ id: 'gdc' })),
  getDiagnosticReportById: jest.fn().mockImplementation((req, res) => res.json({ id: 'gdcid' })),
  getAllObservations: jest.fn().mockImplementation((req, res) => res.json({ id: 'diag' })),
  getObservationById: jest.fn().mockImplementation((req, res) => res.json({ id: 'diagid' })),
  getAllSpecimen: jest.fn().mockImplementation((req, res) => res.json({ id: 'bio' })),
  getSpecimenById: jest.fn().mockImplementation((req, res) => res.json({ id: 'bioid' })),
  getAllResearchStudies: jest.fn().mockImplementation((req, res) => res.json({ id: 'project' })),
  getResearchStudyById: jest.fn().mockImplementation((req, res) => res.json({ id: 'projectid' })),
  getAllPatients: jest.fn().mockImplementation((req, res) => res.json({ id: 'patient' })),
  getPatientById: jest.fn().mockImplementation((req, res) => res.json({ id: 'patientid' })),
}));

const express = require('express');
const supertest = require('supertest');
const router = require('./router');
const controller = require('./controller');

describe('router tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use('/', router);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should route GDC requests to the getAllGdc function of the controller', (done) => {
    supertest(app)
      .get('/diagnosticreport')
      .end(() => {
        expect(controller.getAllDiagnosticReports.mock.calls.length).toEqual(1);
        done();
      });
  });
  it('should route GDC ID requests to the getGdcById function of the controller', (done) => {
    supertest(app)
      .get('/diagnosticreport/foobar')
      .end(() => {
        expect(controller.getDiagnosticReportById.mock.calls.length).toEqual(1);
        done();
      });
  });

  it('should route diagnosis base requests to the getAllDiagnosis function of the controller', (done) => {
    supertest(app)
      .get('/observation')
      .end(() => {
        expect(controller.getAllObservations.mock.calls.length).toEqual(1);
        done();
      });
  });
  it('should route diagnosis ID requests to the getDiagnosisById function of the controller', (done) => {
    supertest(app)
      .get('/observation/foobar')
      .end(() => {
        expect(controller.getObservationById.mock.calls.length).toEqual(1);
        done();
      });
  });

  it('should route Biospecimen base requests to the getAllBiospecimen function of the controller', (done) => {
    supertest(app)
      .get('/specimen')
      .end(() => {
        expect(controller.getAllSpecimen.mock.calls.length).toEqual(1);
        done();
      });
  });
  it('should route Biospecimen ID requests to the getBiospecimenById function of the controller', (done) => {
    supertest(app)
      .get('/specimen/foobar')
      .end((err, res) => {
        expect(controller.getSpecimenById.mock.calls.length).toEqual(1);
        done();
      });
  });

  it('should route Projects base requests to the getAllBiospecimen function of the controller', (done) => {
    supertest(app)
      .get('/researchstudy')
      .end(() => {
        expect(controller.getAllResearchStudies.mock.calls.length).toEqual(1);
        done();
      });
  });
  it('should route Project ID requests to the getBiospecimenById function of the controller', (done) => {
    supertest(app)
      .get('/researchstudy/foobar')
      .end((err, res) => {
        expect(controller.getResearchStudyById.mock.calls.length).toEqual(1);
        done();
      });
  });

  it('should route Patient base requests to the getAllPatients function of the controller', (done) => {
    supertest(app)
      .get('/patient')
      .end(() => {
        expect(controller.getAllPatients.mock.calls.length).toEqual(1);
        done();
      });
  });
  it('should route Patient ID requests to the getPatientById function of the controller', (done) => {
    supertest(app)
      .get('/patient/foobar')
      .end((err, res) => {
        expect(controller.getPatientById.mock.calls.length).toEqual(1);
        done();
      });
  });
});
