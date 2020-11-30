import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import SearchIcon from '@material-ui/icons/Search';
import GitHubIcon from '@material-ui/icons/GitHub';
import ReceiptIcon from '@material-ui/icons/Receipt';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectApp from './selectors';
import reducer from './reducer';
import saga from './saga';
import { loadSmartInfoAction } from './actions';

import Layout from '../../components/Layout';

import Capability from '../Capability';

function App({ dispatch }) {
  useInjectReducer({ key: 'app', reducer });
  useInjectSaga({ key: 'app', saga });

  useEffect(() => {
    dispatch(loadSmartInfoAction());
  }, []);

  const top = [
    {
      icon: <SearchIcon />,
      to: '/',
      text: 'Search',
    },
    {
      icon: <ReceiptIcon />,
      to: '/metadata',
      text: 'CapabilityStatement',
    },
  ];

  const bottom = [
    {
      icon: <GitHubIcon />,
      to: 'https://github.com/databiosphere/fhir',
      text: 'Github',
      external: true,
    },
  ];

  return (
    <Layout topSideBarMenu={top} bottomSideBarMenu={bottom}>
      <Switch>
        <Route path="/metadata">
          <Capability />
        </Route>
      </Switch>
    </Layout>
  );
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(App);
