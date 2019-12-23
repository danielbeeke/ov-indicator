import {produce} from "../vendor/immer.js";

/**
 * Holds information about the device, is a Redux reducer
 */
export function deviceReducer (state = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : null,
  lat: null,
  lng: null,
  geoPermission: null,
}, action) {
  return produce(state, nextState => {

    if (action.type === 'go-online') nextState.isOnline = true;
    if (action.type === 'go-offline') nextState.isOnline = false;

    if (action.type === 'request-geolocation') {
      Object.assign(nextState, action.payload)
    }

    if (action.type === 'get-geo-permission' && action.success) {
      nextState.geoPermission = action.payload;
    }

  });
}