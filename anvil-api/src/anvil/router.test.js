jest.mock('./controller', () => ({
  getAllWorkspaces: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
  getWorkspaceById: jest.fn().mockImplementation((req, res) => res.json({ id: 'test' })),
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
});
