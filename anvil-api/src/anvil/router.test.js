jest.mock('./controller', () => ({
  getAllResearchStudies: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getResearchStudyById: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getAllSamples: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getSampleById: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getAllPatients: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getPatientById: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getAllObservations: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getObservationById: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
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

  it('should route ResearchStudy Requests to getAllResearchStudies controller', (done) => {
    supertest(app)
      .get('/ResearchStudy')
      .end(() => {
        expect(controller.getAllResearchStudies.mock.calls.length).toEqual(1);
        done();
      });
  });

  it('should route ResearchStudy ID Requests to getResearchStudyById controller', (done) => {
    supertest(app)
      .get('/ResearchStudy/foobar')
      .end(() => {
        expect(controller.getResearchStudyById.mock.calls.length).toEqual(1);
        done();
      });
  });

  it('should route Sample Requests to getAllSamples controller', (done) => {
    supertest(app)
      .get('/Sample')
      .end(() => {
        expect(controller.getAllSamples.mock.calls.length).toEqual(1);
        done();
      });
  });

  it('should route Sample ID Requests to getSampleById controller', (done) => {
    supertest(app)
      .get('/Sample/foobar')
      .end(() => {
        expect(controller.getSampleById.mock.calls.length).toEqual(1);
        done();
      });
  });

  it('should route Patient Requests to getAllPatients controller', (done) => {
    supertest(app)
      .get('/Patient')
      .end(() => {
        expect(controller.getAllPatients.mock.calls.length).toEqual(1);
        done();
      });
  });

  it('should route Patient ID Requests to getPatientById controller', (done) => {
    supertest(app)
      .get('/Patient/foobar')
      .end(() => {
        expect(controller.getPatientById.mock.calls.length).toEqual(1);
        done();
      });
  });

  it('should route Observation Requests to getAllObservation controller', (done) => {
    supertest(app)
      .get('/Observation')
      .end(() => {
        expect(controller.getAllObservations.mock.calls.length).toEqual(1);
        done();
      });
  });

  it('should route Observation ID Requests to getObservationById controller', (done) => {
    supertest(app)
      .get('/Observation/foobar')
      .end(() => {
        expect(controller.getObservationById.mock.calls.length).toEqual(1);
        done();
      });
  });
});
