import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './lib';
import init from './init';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

init(store);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
