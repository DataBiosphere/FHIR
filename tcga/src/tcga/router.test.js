jest.mock('./controller', () => ({
  getAll: jest.fn().mockImplementation((req, res) => res.json({ message: 'test' })),
  getById: jest.fn().mockImplementation((req, res) => res.json({ message: 'test' })),
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
      .get('/')
      .end(() => {
        expect(controller.getAll.mock.calls.length).toEqual(1);
        done();
      });
  });
  it('should route ID requests to the getById function of the controller', (done) => {
    supertest(app)
      .get('/foobar')
      .end(() => {
        expect(controller.getById.mock.calls.length).toEqual(1);
        done();
      });
  });
});
