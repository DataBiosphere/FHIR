const axios = require('axios');

const { TCGA_URL } = process.env;

class TCGA {
  getAll({ page, pageSize } = {}) {
    return axios.get(`${TCGA_URL}/api/tcga`, { params: { page, pageSize } });
  }

  async getByCaseId(id) {
    const { data } = await axios.get(`${TCGA_URL}/api/tcga/${id}`);
    return data;
  }
}

module.exports = TCGA;
