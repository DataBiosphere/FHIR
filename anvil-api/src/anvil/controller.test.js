jest.mock('./service', () => ({
  getAllWorkspaces: jest.fn().mockImplementation(() => [[{ id: 'test' }], 100]),
  getWorkspaceById: jest.fn().mockImplementation(() => ({ id: 'test' })),
}));

const { exceptions } = require('../logger');
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
});
