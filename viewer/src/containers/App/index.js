import React from 'react';
import { connect } from 'react-redux';
import { Router } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';

import { loadSmartInfoAction } from './actions';
import { getSmartError, getPatient, getSmartInfo } from './selectors';
import history from '../../modules/history';
import Navbar from '../../components/Navbar';

const Container = styled.div`
  margin-left: 300px;
  margin-right: 300px;
`;

const TextArea = styled.textarea`
  width: 100%;
`;

class App extends React.Component {
  componentDidMount() {
    const { initializeSmartClient } = this.props;
    initializeSmartClient();
  }

  render() {
    const { error, smart, patient } = this.props;
    return (
      <Router history={history}>
        <Helmet />
        <Container style={{ marginTop: '2rem' }}>
          <Navbar />
          <TextArea rows={30} value={JSON.stringify(smart, null, 4)} />
        </Container>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return { error: getSmartError(state), smart: getSmartInfo(state), patient: getPatient(state) };
}

function mapDispatchToProps(dispatch) {
  return {
    initializeSmartClient: () => dispatch(loadSmartInfoAction()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
