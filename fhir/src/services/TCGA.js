const axios = require('axios');

const { TCGA_URL } = process.env;

class TCGA {
  async getAll({ page, pageSize } = {}) {
    const { data } = await axios.get(`${TCGA_URL}/api/tcga`, { params: { page, pageSize } });
    const { results, count } = data;
    return [results, count];
  }

  async getByCaseId(id) {
    const { data } = await axios.get(`${TCGA_URL}/api/tcga/${id}`);
    return data;
  }
}

module.exports = TCGA;
