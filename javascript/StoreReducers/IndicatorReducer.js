import {produce} from "../vendor/immer.js";

/**
 * Prepares indicator information, is a Redux reducer
 *
 * A bit different than the rest. We use the nextFullState here to calculate the indication.
 *
 */
export function indicatorReducer (state = {
  phase: null,
  distance: null,
  walkInMinutes: null,
  averageWalkingSpeed: 5000,
  prepareMinutes: 1
}, action,) {
  return produce(state, nextState => {

    if (action.type === 'set-average-walking-speed') {
      nextState.averageWalkingSpeed = action.payload.averageWalkingSpeed;
    }

    if (action.type === 'set-prepare-minutes') {
      nextState.prepareMinutes = action.payload.prepareMinutes;
    }

    return nextState;
  });
}
