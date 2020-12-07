import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SearchIcon from '@material-ui/icons/Search';
import GitHubIcon from '@material-ui/icons/GitHub';
import ReceiptIcon from '@material-ui/icons/Receipt';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';

import { getSmartInfo, selectApp } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { loadSmartInfoAction } from './actions';

import Layout from '../../components/Layout';

import Capability from '../Capability';
import Search from '../Search';

function App(props) {
  const { dispatch, smart } = props;
  const { serverUrl: iss } = smart;

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
    <Layout topSideBarMenu={top} bottomSideBarMenu={bottom} iss={iss}>
      <Switch>
        <Route path="/" exact>
          <Search />
        </Route>
        <Route path="/metadata">
          <Capability />
        </Route>
      </Switch>
    </Layout>
  );
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  smart: PropTypes.shape({
    serverUrl: PropTypes.string,
  }),
};

App.defaultProps = {
  smart: undefined,
};

const mapStateToProps = (state) => ({
  app: selectApp(state),
  smart: getSmartInfo(state) || {},
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(App);
