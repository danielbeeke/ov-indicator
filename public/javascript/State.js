import * as Redux from './vendor/redux.min.js';
import {RootStoreReducer} from "./RootStoreReducer.js";

/**
 * Redux reducer
 * @param state
 * @param action
 * @returns {{loadingPhase: string}|any}
 * @constructor
 */


/**
 * The store class
 * With small helpers to make redux easier.
 */
class StoreClass {
  constructor () {
    this.redux = Redux.createStore(RootStoreReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    this.oldState = this.redux.getState();
    this.callbacks = {};

    /**
     * This monitors the state and calls subscribed callbacks.
     */
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

  /**
   * Triggers an action to redux.
   * @param action
   * @param args
   */
  trigger (action, args) {
    this.redux.dispatch({
      type: action,
      args: args
    });
  }

  transaction (label, callback) {
    this.redux.dispatch({
      type: label,
      callback: callback
    });
  }

  /**
   * Watches a specific key of the state.
   * @param key
   * @param callback
   */
  watch (key, callback) {
    if (!this.callbacks[key]) this.callbacks[key] = [];
    this.callbacks[key].push(callback);
  }

  get () {
    return this.redux.getState();
  }

}

/**
 * Export the store as a singleton.
 */
export const State = new StoreClass();