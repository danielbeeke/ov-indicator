import {produce} from "../vendor/immer.js";
import {Translate as t} from '../Helpers/Translate.js';

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
        nextState.message = t(`Er ging iets mis met het downloaden van informatie. Heb je wel internet verbinding?`);
        nextState.type = 'no-connection';
      }

      if (action.type === 'request-geolocation') {
        nextState.message = t(`De app heeft je locatie nodig om te kunnen functioneren. Wil je checken of het aan staat?`);
        nextState.type = 'no-geolocation';
      }
    }
  });
}