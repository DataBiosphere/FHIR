import FHIR from 'fhirclient';

let client: any;

const connect = async () => {
  if (client) {
    return client;
  }
  return FHIR.oauth2.ready().then((smart) => {
    client = smart;
    return client;
  });
};

export default connect;
