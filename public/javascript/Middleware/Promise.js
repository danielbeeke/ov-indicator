import {isPromise} from '../Core/Helpers.js';

export function promise({ dispatch }) {
  return next => action => {
    return isPromise(action.payload) && typeof action.promiseResult === 'undefined'
      ? action.payload
        .then(result => dispatch({ ...action, payload: result, success: true }))
        .catch(error => {
          dispatch({ ...action, payload: error, error: true });
          return Promise.reject(error);
        })
      : next(action);
  };
}