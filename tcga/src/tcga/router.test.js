jest.mock('./controller', () => ({
  getAllGdc: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getGdcById: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getAllDiagnosis: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getDiagnosisById: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getAllBiospecimen: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getBiospecimenById: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
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
});
