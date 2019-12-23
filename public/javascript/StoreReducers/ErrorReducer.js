import {produce} from "../vendor/immer.js";

/**
 * Catches error information, is a Redux reducer
 */
export function errorReducer (state = {
  message: null,
  type: null
}, action) {
  return produce(state, nextState => {
    if (action.error) {
      if (action.type.substr(0, 5) === 'fetch') {
        nextState.message = 'Er ging iets mis met het downloaden van informatie. Heb je wel internet verbinding?';
        nextState.type = 'no-connection';
      }

      if (action.type === 'request-geolocation') {
        nextState.message = 'De app heeft je locatie nodig om te kunnen functioneren. Wil je checken of het aan staat?';
        nextState.type = 'no-geolocation';
      }
    }
  });
}