/**
 *
 * Search
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';

import { selectBundle } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { GET_BUNDLE } from './constants';

export function Search(props) {
  const { dispatch } = props;
  useInjectReducer({ key: 'search', reducer });
  useInjectSaga({ key: 'search', saga });

  useEffect(() => {
    // TODO replace me with an action creator
    dispatch({ type: GET_BUNDLE, page: 1, pageSize: 20 });
  }, []);

  return (
    <div>
      <Helmet>
        <title>Search</title>
        <meta name="description" content="Description of Search" />
      </Helmet>
      <h1>Search</h1>
      <h2>Raw Bundle</h2>
      <pre>
        <code>{JSON.stringify(props.bundle, null, 2)}</code>
      </pre>
    </div>
  );
}

Search.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  console.log(state);
  return { bundle: selectBundle(state) };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Search);
