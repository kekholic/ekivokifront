/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/store';

const root = ReactDOM.createRoot(
  document.getElementById('wrapper') as HTMLElement,
);
root.render(
  <Provider store={store}>

    <App />

  </Provider>,
);

reportWebVitals();
