jest.mock('./service', () => ({
  getAllWorkspaces: jest.fn().mockImplementation(() => [[{ id: 'test' }], 100]),
  getWorkspaceById: jest.fn().mockImplementation(() => ({ id: 'test' })),
  getAllSamples: jest.fn().mockImplementation(() => [[{ id: 'test' }], 100]),
  getSampleById: jest.fn().mockImplementation(() => ({ id: 'test' })),
  getAllSubjects: jest.fn().mockImplementation(() => [[{ id: 'test' }], 100]),
  getSubjectById: jest.fn().mockImplementation(() => ({ id: 'test' })),
  getAllObservations: jest.fn().mockImplementation(() => [[{ id: 'test' }], 100]),
  getObservationById: jest.fn().mockImplementation(() => ({ id: 'test' })),
}));

const controller = require('./controller');

describe('ANVIL controller tests', () => {
  it('should get all Workspace data', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllWorkspaces(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 100, results: [{ id: 'test' }] });
  });

  it('should get Workspace data by ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        id: 'foobar',
      },
    };

    await controller.getWorkspaceById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'test' });
  });

  it('should get all Sample data', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllSamples(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 100, results: [{ id: 'test' }] });
  });
  it('should get all Sample data with Workspace params', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        workspace: 'foobar',
      },
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllSamples(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 100, results: [{ id: 'test' }] });
  });

  it('should get Sample data by ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        id: 'foobar',
      },
    };

    await controller.getSampleById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'test' });
  });
  it('should get Sample data by Workspace ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        workspace: 'foo',
        id: 'bar',
      },
    };

    await controller.getSampleById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'test' });
  });

  it('should get all Subject data', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllSubjects(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 100, results: [{ id: 'test' }] });
  });
  it('should get all Subject data with Workspace params', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        workspace: 'foobar',
      },
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllSubjects(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 100, results: [{ id: 'test' }] });
  });

  it('should get Subject data by ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        id: 'foobar',
      },
    };

    await controller.getSubjectById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'test' });
  });
  it('should get Subject data by Workspace ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        workspace: 'foo',
        id: 'bar',
      },
    };

    await controller.getSubjectById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'test' });
  });
});
