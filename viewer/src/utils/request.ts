const makeRequester = (client: any) => (args: any) => {
  return client.request(args);
};

export default makeRequester;
