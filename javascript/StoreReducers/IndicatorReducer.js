import {produce} from "../vendor/immer.js";
import {getPhase} from '../Helpers/GetPhase.js';
import {calculateDistance} from '../Helpers/CalculateDistance.js';

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
}, action, fullState, nextFullState) {
  return produce(state, nextPartialState => {

    if (action.type === 'set-average-walking-speed') {
      nextPartialState.averageWalkingSpeed = action.payload.averageWalkingSpeed;
    }

    if (action.type === 'set-prepare-minutes') {
      nextPartialState.prepareMinutes = action.payload.prepareMinutes;
    }

    if (fullState) {
      const t = nextFullState.tripSelector;
      const d = nextFullState.device;
      const i = fullState.indicator;

      if (t.selectedStop && t.selectedTrip) {
        nextPartialState.distance = calculateDistance(t.selectedStop.stop_lat, t.selectedStop.stop_lon, d.lat, d.lng);
        nextPartialState.phase = getPhase(t.selectedTrip.ts, nextPartialState.distance, t.selectedTrip.punctuality, i.averageWalkingSpeed, i.prepareMinutes);
        nextPartialState.walkInMinutes = Math.round(nextPartialState.distance / i.averageWalkingSpeed * 60);
      }
      else {
        nextPartialState.distance = null;
        nextPartialState.phase = null;
        nextPartialState.walkInMinutes = null;
      }
    }

    return nextPartialState;
  });
}
