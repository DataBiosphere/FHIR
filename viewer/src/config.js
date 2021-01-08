export default {
  clientId: process.env.REACT_APP_CLIENT_ID,
  scope: process.env.REACT_APP_SCOPE,
  iss: process.env.REACT_APP_ISS,
  redirectUri: process.env.REACT_APP_REDIRECT_URI || 'https://broad-fhir-dev.ue.r.appspot.com/',
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
};
