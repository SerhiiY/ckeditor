import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from '../reducers/rootReducer';
import loggerMiddleware from '../middlewares/logger';
import { getDefaultMiddleware } from '@reduxjs/toolkit';

let middlewares = [...getDefaultMiddleware()];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(loggerMiddleware);
}

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(...middlewares),
  ),
);


export default store;
