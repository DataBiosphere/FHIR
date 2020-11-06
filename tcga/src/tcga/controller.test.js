jest.mock('./service', () => ({
  getAllGdc: jest.fn().mockImplementation(() => [100, [{ message: 'test' }]]),
  getGdcById: jest.fn().mockImplementation(() => ({ message: 'test' })),
}));

const controller = require('./controller');

describe('TCGA controller tests', () => {
  it('should get all GDC data', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllGdc(mockReq, mockRes);

    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: [{ message: 'test' }], results: 100 });
  });

  it('should get GDC data by ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        id: 'foobar',
      },
    };

    await controller.getGdcById(mockReq, mockRes);

    expect(mockRes.json.mock.calls[0][0]).toEqual({ message: 'test' });
  });
});
