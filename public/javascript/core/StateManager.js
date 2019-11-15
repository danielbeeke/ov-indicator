import * as Redux from '../vendor/redux.min.js';
import {State as DefaultState} from '../State.js';
import {index, logger} from '../Helpers.js';
import * as StateActions from '../StateActions.js';
/**
 * The StateManager class
 * With small helpers to make redux easier.
 */
class StateManager {
  constructor () {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;
    this.redux = Redux.createStore(DefaultState, composeEnhancers(
      Redux.applyMiddleware(logger)
    ));

    this.oldState = this.redux.getState();
    this.callbacks = {};

    /**
     * This monitors the state and calls subscribed callbacks.
     */
    this.redux.subscribe(() => {
      let nextState = this.redux.getState();

      Object.keys(this.callbacks).forEach(key => {
        if (index(this.oldState, key) !== index(nextState, key)) {
          this.callbacks[key].forEach(callback => callback(index(nextState, key), key))
        }
      });

      this.oldState = nextState;
    });
  }

  /**
   * Triggers an action.
   * @param action
   * @param args
   */
  trigger (action, args) {
    if (StateActions[action]) {
      if (Array.isArray(args)) {
        StateActions[action](...args);
      }
      else {
        StateActions[action](args);
      }
    }
  }

  /**
   * Does a transaction to redux.
   * @param label
   * @param callback
   */
  transaction (label, callback) {
    this.redux.dispatch({
      type: label,
      callback: callback
    });
  }

  /**
   * Watches a specific key with dot notation of the state.
   * @param keys
   * @param callback
   */
  watch (keys, callback) {
    if (!Array.isArray(keys)) { keys = [keys] }
    let state = this.redux.getState();

    keys.forEach(key => {
      if (!this.callbacks[key]) this.callbacks[key] = [];
      this.callbacks[key].push(callback);
      this.callbacks[key].forEach(callback => callback(index(state, key), key))
    });
  }

  get () {
    return this.redux.getState();
  }

}

/**
 * Export the store as a singleton.
 */
export const State = new StateManager();