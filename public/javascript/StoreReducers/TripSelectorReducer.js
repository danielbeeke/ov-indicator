import {produce} from "../vendor/immer.js";
import {currentArrivals} from '../Core/Helpers.js';

/**
 * Holds information about the stops and trips, is a Redux reducer
 */
export function tripSelectorReducer (state = {
  stops: [],
  trips: [],
  selectedStop: null,
  selectedTrip: null,
  favoriteStops: [],
  favoriteTrips: []
}, action) {
  return produce(state, nextState => {

    if (action.type === 'get-stops') {
      const stops = action.payload;
      nextState.stops = stops;

      if (!state.selectedStop || !stops.find(stop => stop.stop_id === state.selectedStop.stop_id)) {
        nextState.selectedStop = stops[0];
      }
    }

    if (action.type === 'get-trips') {
      nextState.trips = action.payload;

      if (!state.selectedTrip || !currentArrivals(nextState).find(arrival => arrival.trip_id === state.selectedTrip.trip_id)) {
        nextState.selectedTrip = currentArrivals(nextState)[0];
      }
    }

    if (action.type === 'set-stop') {
      nextState.selectedStop = state.stops.find(stop => stop.stop_id === action.payload.stopId);
    }

    if (action.type === 'set-trip') {
      nextState.selectedTrip = currentArrivals(state).find(arrival => arrival.trip_id === action.payload.tripId);
    }

    if (action.type === 'toggle-stop-favorite') {
      if (state.favoriteStops.includes(state.selectedStop.stop_id)) {
        nextState.favoriteStops = state.favoriteStops.filter(favoriteStop => favoriteStop !== state.selectedStop.stop_id)
      }
      else {
        nextState.favoriteStops.push(state.selectedStop.stop_id);
      }
    }

    if (action.type === 'toggle-trip-favorite') {
      console.log(action)
    }

  });
}