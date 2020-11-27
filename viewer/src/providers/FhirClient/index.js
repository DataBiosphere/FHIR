import FHIR from 'fhirclient';
import React, { useState, useEffect } from 'react';

const FhirClientStateContext = React.createContext();

function FhirClientProvider({ children }) {
  const [state, setClient] = useState();

  useEffect(() => {
    const connect = async () => {
      try {
        FHIR.oauth2.ready().then((client) => {
          console.log('setting client');
          setClient(client);
        });
      } catch (e) {
        console.log(e);
        console.log(e);
        console.log(e);
        console.log(e);
      }
    };
    connect();
  }, []);

  return (
    <FhirClientStateContext.Provider value={state}>{children}</FhirClientStateContext.Provider>
  );
}

function useFhirClient() {
  const context = React.useContext(FhirClientStateContext);
  return context;
}
export { FhirClientProvider, useFhirClient };
