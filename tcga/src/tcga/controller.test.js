jest.mock('./service', () => ({
  getAll: jest.fn().mockImplementation(() => [{ message: 'test' }]),
}));

const controller = require('./controller');

describe('TCGA controller tests', () => {
  it('should get all', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    await controller.getAll(null, mockRes);

    expect(mockRes.json.mock.calls[0][0]).toEqual([{ message: 'test' }]);
  });
});
