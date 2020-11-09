const swaggerJSDoc = require('swagger-jsdoc');
const { version, description } = require('../../package.json');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: description,
      version,
    },
    host: 'http://localhost:3001',
    basePath: '/api',
  },
  apis: ['./src/**/*.js'],
};

module.exports = swaggerJSDoc(options);
