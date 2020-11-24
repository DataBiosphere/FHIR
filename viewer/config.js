module.exports = {
  clientId:
    '738532639593-8hg9uu5e9skh4i4thi7l76h8tdtlv2uu.apps.googleusercontent.com' ||
    process.env.CLIENT_ID,
  scope: 'openid profile' || process.env.SCOPE,
  iss: 'http://34.75.179.65/4_0_0/' || process.env.ISS,
  redirectUri: 'http://localhost:3000' || process.env.REDIRECT_URI,
  clientSecret: 'AITn5oeSt2vpqTD0a3BGzz9Q' || process.env.CLIENT_SECRET,
};
