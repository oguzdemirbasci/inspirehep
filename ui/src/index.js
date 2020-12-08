import 'core-js/modules/es7.object.entries';
import 'core-js/modules/es7.array.includes';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import 'tachyons';
import * as Sentry from '@sentry/browser';
import { ApolloProvider } from '@apollo/react-hooks';

import { unregister as unregisterServiceWorker } from './registerServiceWorker';
import createStore, { history } from './store';
import App from './App';
import ErrorAppCrash from './errors/components/ErrorAppCrash';
import ErrorBoundary from './common/components/ErrorBoundary';
import { injectTrackerToHistory, getClientId } from './tracker';
import { getConfigFor } from './common/config';
import client from './common/apollo.ts';

Sentry.init({
  dsn: getConfigFor('REACT_APP_SENTRY_DSN'),
  release: process.env.REACT_APP_VERSION,
});
Sentry.setUser({ id: getClientId() });

const store = createStore();

ReactDOM.render(
  // eslint-disable-next-line react/jsx-filename-extension
  <ErrorBoundary renderError={() => <ErrorAppCrash />}>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ConnectedRouter history={injectTrackerToHistory(history)}>
          <Switch>
            <Route path="/" component={App} />
          </Switch>
        </ConnectedRouter>
      </ApolloProvider>
    </Provider>
  </ErrorBoundary>,
  document.getElementById('root')
);

// TODO: change to CRA 2.0 service worker script and register instead of unregistering.
// registerServiceWorker();
unregisterServiceWorker();
