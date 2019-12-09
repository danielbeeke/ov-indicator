import {produce} from "../vendor/immer.js";

/**
 * Holds information about the device, is a Redux reducer
 */
export function deviceReducer (state = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : null,
  lat: null,
  lng: null,
}, action) {
  return produce(state, nextState => {

    if (action.type === 'go-online') nextState.isOnline = true;
    if (action.type === 'go-offline') nextState.isOnline = false;

    if (action.type === 'request-geolocation') {
      Object.assign(nextState, action.payload)
    }

  });
}