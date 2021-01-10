jest.mock('./service', () => ({
  getAllGdc: jest.fn().mockImplementation(() => [[{ id: 'test' }], 100]),
  getGdcById: jest.fn().mockImplementation(() => ({ id: 'test' })),
  getAllDiagnosis: jest.fn().mockImplementation(() => [[{ id: 'test' }], 100]),
  getDiagnosisById: jest.fn().mockImplementation(() => ({ id: 'test' })),
  getAllBiospecimen: jest.fn().mockImplementation(() => [[{ id: 'test' }], 100]),
  getBiospecimenById: jest.fn().mockImplementation(() => ({ id: 'test' })),
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

    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 100, results: [{ id: 'test' }] });
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

    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'test' });
  });

  it('should get all Diagnosis data', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllDiagnosis(mockReq, mockRes);

    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 100, results: [{ id: 'test' }] });
  });

  it('should get Diagnosis data by ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        id: 'foobar',
      },
    };

    await controller.getDiagnosisById(mockReq, mockRes);

    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'test' });
  });

  it('should get all Biospecimen data', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllBiospecimen(mockReq, mockRes);

    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 100, results: [{ id: 'test' }] });
  });

  it('should get Biospecimen data by ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        id: 'foobar',
      },
    };

    await controller.getBiospecimenById(mockReq, mockRes);

    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'test' });
  });
});
