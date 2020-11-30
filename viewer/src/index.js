import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import configureStore from './store';

import theme from './theme';

import App from './containers/App';

import history from './utils/history';

import './styles.css';

const store = configureStore({}, history);

const MOUNT_NODE = document.getElementById('root');

let fhirClientRef;

export const getFhirClient = () => fhirClientRef.state;

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Switch>
            <Route path="/" component={App} />
          </Switch>
        </ThemeProvider>
      </HelmetProvider>
    </ConnectedRouter>
  </Provider>,
  MOUNT_NODE
);
