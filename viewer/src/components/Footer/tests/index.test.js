import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router-dom';

import Footer from '../index';
import configureStore from '../../../configureStore';

describe('<Footer />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render and match the snapshot', () => {
    const renderedComponent = renderer
      .create(
        <Provider store={store}>
          <Footer />
        </Provider>
      )
      .toJSON();

    expect(renderedComponent).toMatchSnapshot();
  });
});
