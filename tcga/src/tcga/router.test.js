jest.mock('./controller', () => ({
  getAll: jest.fn().mockImplementation((req, res) => res.json({ message: 'test' })),
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

  it('should router get all to the controller', (done) => {
    supertest(app)
      .get('/')
      .end(() => {
        expect(controller.getAll.mock.calls.length).toEqual(1);
        done();
      });
  });
});
