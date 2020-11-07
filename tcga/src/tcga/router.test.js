jest.mock('./controller', () => ({
  getAllGdc: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getGdcById: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getAllDiagnosis: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getDiagnosisById: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
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

  it('should route base requests to the getAll function of the controller', (done) => {
    supertest(app)
      .get('/gdc')
      .end(() => {
        expect(controller.getAllGdc.mock.calls.length).toEqual(1);
        done();
      });
  });
  it('should route ID requests to the getById function of the controller', (done) => {
    supertest(app)
      .get('/gdc/foobar')
      .end(() => {
        expect(controller.getGdcById.mock.calls.length).toEqual(1);
        done();
      });
  });
});
