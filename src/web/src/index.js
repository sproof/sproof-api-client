import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react'
import configureStore from './store/configureStore';

import {Sproof} from 'js-sproof-client';

import {HashRouter, Route, Switch} from 'react-router-dom';
import indexRoutes from './routes/index';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import theme from './style/theme'

import {getHost, getWsHost} from './env'

const {store, persistor} = configureStore();

window.onload = () => {
  let base = getHost();
  let wsUri = getWsHost();
  window.host = getHost();
  let sp = new Sproof({
      uri: base,
      socket: wsUri,
  });

  window.sp = sp;

};


ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <MuiThemeProvider theme={ createMuiTheme(theme)}>
        <HashRouter>
          <Switch>
            {indexRoutes.map((prop, key) => {
              return <Route path={prop.path} component={prop.component} key={key} />;
            })}
          </Switch>
        </HashRouter>
      </MuiThemeProvider>
    </PersistGate>

  </Provider>,
  document.getElementById('root')
);