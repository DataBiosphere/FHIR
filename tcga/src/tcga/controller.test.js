jest.mock('./service', () => ({
  getAllGdc: jest.fn().mockImplementation(() => [[{ id: 'gdc' }], 1]),
  getGdcById: jest.fn().mockImplementation(() => ({ id: 'gdcid' })),
  getAllDiagnosis: jest.fn().mockImplementation(() => [[{ id: 'diag' }], 2]),
  getDiagnosisById: jest.fn().mockImplementation(() => ({ id: 'diagid' })),
  getAllBiospecimen: jest.fn().mockImplementation(() => [[{ id: 'bio' }], 3]),
  getBiospecimenById: jest.fn().mockImplementation(() => ({ id: 'bioid' })),
  getAllProjects: jest.fn().mockImplementation(() => [[{ id: 'project' }], 4]),
  getProjectById: jest.fn().mockImplementation(() => ({ id: 'projectid' })),
  getAllPatients: jest.fn().mockImplementation(() => [[{ id: 'patient' }], 5]),
  getPatientById: jest.fn().mockImplementation(() => ({ id: 'patientid' })),
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
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 1, results: [{ id: 'gdc' }] });
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
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'gdcid' });
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
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 2, results: [{ id: 'diag' }] });
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
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'diagid' });
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
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 3, results: [{ id: 'bio' }] });
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
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'bioid' });
  });

  it('should get all Project data', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllProjects(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 4, results: [{ id: 'project' }] });
  });
  it('should get Project data by ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        id: 'foobar',
      },
    };

    await controller.getProjectById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'projectid' });
  });

  it('should get all Patient data', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      query: {
        page: 1,
        pageSize: 10,
      },
    };

    await controller.getAllPatients(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ count: 5, results: [{ id: 'patient' }] });
  });
  it('should get Patient data by ID', async () => {
    const mockRes = {
      json: jest.fn(),
    };

    const mockReq = {
      params: {
        id: 'foobar',
      },
    };

    await controller.getPatientById(mockReq, mockRes);
    expect(mockRes.json.mock.calls[0][0]).toEqual({ id: 'patientid' });
  });
});
