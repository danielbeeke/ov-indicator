import {produce} from "../vendor/immer.js";

/**
 * Holds information about the device, is a Redux reducer
 */
export function deviceReducer (state = {
  isOnline: navigator.onLine,
  lat: null,
  lng: null,
}, action) {
  return produce(state, nextState => {

    if (action.type === 'go-online') nextState.isOnline = true;
    if (action.type === 'go-offline') nextState.isOnline = false;

    if (action.type === 'get-geolocation') {
      Object.assign(nextState, action.payload)
    }

  });
}