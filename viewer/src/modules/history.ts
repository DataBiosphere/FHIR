// @flow
import { createBrowserHistory } from 'history';
import qs from 'qs';

interface History {
  [key: string]: any;
}

const history: History = createBrowserHistory();

history.listen(() => {
  history.location = {
    ...history.location,
    query: qs.parse(history.location.search.substr(1)),
    state: history.location.state || {},
  };
});

const { go, goBack, push, replace } = history;

export { go, goBack, push, replace };
export default history;
