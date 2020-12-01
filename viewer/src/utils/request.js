const makeRequester = (client) => (args) => {
  return client.request(args);
};

export default makeRequester;
