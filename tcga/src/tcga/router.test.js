jest.mock('./controller', () => ({
  getAllGdc: jest.fn().mockImplementation((req, res) => res.json({ id: 'gdc' })),
  getGdcById: jest.fn().mockImplementation((req, res) => res.json({ id: 'gdcid' })),
  getAllDiagnosis: jest.fn().mockImplementation((req, res) => res.json({ id: 'diag' })),
  getDiagnosisById: jest.fn().mockImplementation((req, res) => res.json({ id: 'diagid' })),
  getAllBiospecimen: jest.fn().mockImplementation((req, res) => res.json({ id: 'bio' })),
  getBiospecimenById: jest.fn().mockImplementation((req, res) => res.json({ id: 'bioid' })),
  getAllProjects: jest.fn().mockImplementation((req, res) => res.json({ id: 'project' })),
  getProjectById: jest.fn().mockImplementation((req, res) => res.json({ id: 'projectid' })),
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
      .get('/gdc')
      .end(() => {
        expect(controller.getAllGdc.mock.calls.length).toEqual(1);
        done();
      });
  });
  it('should route GDC ID requests to the getGdcById function of the controller', (done) => {
    supertest(app)
      .get('/gdc/foobar')
      .end(() => {
        expect(controller.getGdcById.mock.calls.length).toEqual(1);
        done();
      });
  });

  it('should route diagnosis base requests to the getAllDiagnosis function of the controller', (done) => {
    supertest(app)
      .get('/diagnosis')
      .end(() => {
        expect(controller.getAllDiagnosis.mock.calls.length).toEqual(1);
        done();
      });
  });
  it('should route diagnosis ID requests to the getDiagnosisById function of the controller', (done) => {
    supertest(app)
      .get('/diagnosis/foobar')
      .end(() => {
        expect(controller.getDiagnosisById.mock.calls.length).toEqual(1);
        done();
      });
  });

  it('should route Biospecimen base requests to the getAllBiospecimen function of the controller', (done) => {
    supertest(app)
      .get('/biospecimen')
      .end(() => {
        expect(controller.getAllBiospecimen.mock.calls.length).toEqual(1);
        done();
      });
  });
  it('should route Biospecimen ID requests to the getBiospecimenById function of the controller', (done) => {
    supertest(app)
      .get('/biospecimen/foobar')
      .end((err, res) => {
        expect(controller.getBiospecimenById.mock.calls.length).toEqual(1);
        done();
      });
  });

  it('should route Projects base requests to the getAllBiospecimen function of the controller', (done) => {
    supertest(app)
      .get('/projects')
      .end(() => {
        expect(controller.getAllProjects.mock.calls.length).toEqual(1);
        done();
      });
  });
  it('should route Project ID requests to the getBiospecimenById function of the controller', (done) => {
    supertest(app)
      .get('/projects/foobar')
      .end((err, res) => {
        expect(controller.getProjectById.mock.calls.length).toEqual(1);
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
