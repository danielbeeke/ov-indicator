import * as Redux from './vendor/redux.min.js';
import {produce} from 'https://unpkg.com/immer@5.0.0/dist/immer.module.js';
import * as StateReducers from './StateReducers.js';

/**
 * Redux reducer
 * @param state
 * @param action
 * @returns {{loadingPhase: string}|any}
 * @constructor
 */
function OvIndicatorStore (state, action = null) {

  /**
   * Initial state.
   */
  if (typeof state === 'undefined') {
    return {
      loadingPhase: '',
      busStops: [],
      lat: null,
      lng: null,
      currentGeolocationWatcher: null,
      selectedBusStop: null,
      selectedTrip: null,
      favoriteBusStops: localStorage.getItem('favoriteBusStops') ? localStorage.getItem('favoriteBusStops').split(',') : [],
      favoriteTrips: localStorage.getItem('favoriteTrips') ? localStorage.getItem('favoriteTrips').split(',') : []
    }
  }

  return produce(state, draft => {
    if (StateReducers[action.type]) {
      StateReducers[action.type](draft, action, state);
    }
  });
}

/**
 * The store class
 * With small helpers to make redux easier.
 */
class StoreClass {
  constructor () {
    this.redux = Redux.createStore(OvIndicatorStore,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    this.oldState = this.redux.getState();
    this.callbacks = {};

    this.redux.subscribe(() => {
      let newState = this.redux.getState();

      Object.keys(this.callbacks).forEach(key => {
        if (this.oldState[key] !== newState[key]) {
          this.callbacks[key].forEach(callback => callback(newState[key]))
        }
      });

      this.oldState = newState;
    });
  }

  trigger (action, args) {
    this.redux.dispatch({
      type: action,
      args: args
    });
  }

  watch (key, callback) {
    if (!this.callbacks[key]) this.callbacks[key] = [];
    this.callbacks[key].push(callback);
  }

  getState () {
    return this.redux.getState();
  }

}

/**
 * Export the store as a singleton.
 */
export const Store = new StoreClass();