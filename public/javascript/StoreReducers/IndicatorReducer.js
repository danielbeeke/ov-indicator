import {produce} from "../vendor/immer.js";
import {createIndication} from '../Helpers/Various.js';

/**
 * Prepares indicator information, is a Redux reducer
 */
export function indicatorReducer (state = {
  phase: null,
  timeLeft: null,
  distance: null,
  prepareMarge: null,
  departureTime: null,
  leaveTimestamp: null,
  averageWalkInHours: null,
}, action, fullState) {
  return produce(state, nextState => {

    if (['recalculate'].includes(action.type)) {
      Object.assign(nextState, createIndication(fullState, Date.now() / 1000));
    }

  });
}