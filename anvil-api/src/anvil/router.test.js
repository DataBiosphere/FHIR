jest.mock('./controller', () => ({
  getAllWorkspaces: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getWorkspaceById: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getAllSamples: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getSampleById: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getAllSubjects: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getSubjectById: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
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

  it('should route Workspace Requests to getAllWorkspaces controller', (done) => {
    supertest(app)
      .get('/Workspace')
      .end(() => {
        expect(controller.getAllWorkspaces.mock.calls.length).toEqual(1);
        done();
      });
  });

  it('should route Workspace ID Requests to getWorkspaceById controller', (done) => {
    supertest(app)
      .get('/Workspace/foobar')
      .end(() => {
        expect(controller.getWorkspaceById.mock.calls.length).toEqual(1);
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
  it('should route Sample Requests with a Workspace to getAllSamples controller', (done) => {
    supertest(app)
      .get('/Workspace/foobar/Sample')
      .end(() => {
        expect(controller.getAllSamples.mock.calls.length).toEqual(2);
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
  it('should route Workspace Sample ID Requests to getSampleById controller', (done) => {
    supertest(app)
      .get('/workspace/foo/Sample/bar')
      .end(() => {
        expect(controller.getSampleById.mock.calls.length).toEqual(2);
        done();
      });
  });

  it('should route Subject Requests to getAllSubjects controller', (done) => {
    supertest(app)
      .get('/Subject')
      .end(() => {
        expect(controller.getAllSubjects.mock.calls.length).toEqual(1);
        done();
      });
  });
  it('should route Subject Requests with a Workspace to getAllSubjects controller', (done) => {
    supertest(app)
      .get('/Workspace/foobar/Subject')
      .end(() => {
        expect(controller.getAllSubjects.mock.calls.length).toEqual(2);
        done();
      });
  });

  it('should route Subject ID Requests to getSubjectById controller', (done) => {
    supertest(app)
      .get('/Subject/foobar')
      .end(() => {
        expect(controller.getSubjectById.mock.calls.length).toEqual(1);
        done();
      });
  });
  it('should route Workspace Subject ID Requests to getSubjectById controller', (done) => {
    supertest(app)
      .get('/workspace/foo/Subject/bar')
      .end(() => {
        expect(controller.getSubjectById.mock.calls.length).toEqual(2);
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
  it('should route Observation Requests with a Workspace to getAllObservations controller', (done) => {
    supertest(app)
      .get('/Workspace/foobar/Observation')
      .end(() => {
        expect(controller.getAllObservations.mock.calls.length).toEqual(2);
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
  it('should route Workspace Observation ID Requests to getObservationById controller', (done) => {
    supertest(app)
      .get('/workspace/foo/Observation/bar')
      .end(() => {
        expect(controller.getObservationById.mock.calls.length).toEqual(2);
        done();
      });
  });
});
