import React from 'react';
import ReactDOM from 'react-dom';

import Root from './Components/Routes';

import { configureStore } from './store';

document.addEventListener('DOMContentLoaded', () => {
  let  store;
  if (window.user) {
    const preloadedState = { sessions: {currentUser: window.user}};
    store = configureStore(preloadedState);
    delete window.user;
  } else {
    store = configureStore();
  }

  const rootEl = document.getElementById('root');
  ReactDOM.render(<Root store={ store }/>, rootEl);
});
