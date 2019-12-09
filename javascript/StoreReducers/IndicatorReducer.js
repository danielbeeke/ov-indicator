import {produce} from "../vendor/immer.js";
import {getPhase} from '../Helpers/GetPhase.js';
import {calculateDistance} from '../Helpers/CalculateDistance.js';

/**
 * Prepares indicator information, is a Redux reducer
 */
export function indicatorReducer (state = {
  phase: null,
  distance: null,
  walkInMinutes: null,
  averageWalkingSpeed: 5000,
}, action, fullState) {
  return produce(state, nextState => {

    if (fullState) {
      const t = fullState.tripSelector;
      const d = fullState.device;
      const i = fullState.indicator;

      if (t.selectedTrip && t.selectedStop) {
        nextState.distance = calculateDistance(t.selectedStop.stop_lat, t.selectedStop.stop_lon, d.lat, d.lng);
        nextState.phase = getPhase(t.selectedTrip.ts, nextState.distance, i.averageWalkingSpeed);
        nextState.walkInMinutes = Math.round(nextState.distance / i.averageWalkingSpeed * 60);
      }
    }

    return nextState;
  });
}