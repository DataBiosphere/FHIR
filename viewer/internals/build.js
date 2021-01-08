require('dotenv').config();

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

const config = {
  clientId: process.env.REACT_APP_CLIENT_ID,
  scope: process.env.REACT_APP_SCOPE,
  iss: process.env.REACT_APP_ISS,
  redirectUri: process.env.REACT_APP_REDIRECT_URI,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
};

const template = fs.readFileSync(path.join(__dirname, 'launch.handlebars'), 'utf-8');
const templateFunction = Handlebars.compile(template);
const html = templateFunction(config);

fs.writeFileSync(path.join(__dirname, '../public/launch.html'), html);
