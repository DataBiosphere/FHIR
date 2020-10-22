const axios = require('axios');

const { TCGA_URL } = process.env;

class TCGA {
  getAll({ page, pageSize }) {
    return axios.get(`${TCGA_URL}/api/tcga`, { params: { page, pageSize } });
  }
}

module.exports = TCGA;
