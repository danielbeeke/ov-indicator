import {produce} from "../vendor/immer.js";
import {currentArrivals, tripKey} from '../Helpers/Various.js';

/**
 * Holds information about the stops and trips, is a Redux reducer
 */
export function tripSelectorReducer (state = {
  stops: [],
  trips: [],
  selectedStop: null,
  selectedTrip: null,
  favoriteStops: [],
  favoriteStopToggleShouldAnimate: false,
  favoriteTrips: [],
  favoriteTripToggleShouldAnimate: false
}, action) {
  return produce(state, nextState => {

    if (action.type === 'fetch-stops') {
      const stops = action.payload;
      nextState.stops = stops;

      if (!state.selectedStop || !stops.find(stop => stop.stop_id === state.selectedStop.stop_id)) {
        nextState.selectedStop = stops[0];
      }
    }

    if (action.type === 'fetch-trips') {
      nextState.trips = action.payload;

      if (currentArrivals(nextState) && (!state.selectedTrip || !currentArrivals(nextState).find(arrival => arrival.trip_id === state.selectedTrip.trip_id))) {
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
      nextState.favoriteStopToggleShouldAnimate = true;
      if (state.favoriteStops.includes(state.selectedStop.stop_id)) {
        nextState.favoriteStops = state.favoriteStops.filter(favoriteStop => favoriteStop !== state.selectedStop.stop_id)
      }
      else {
        nextState.favoriteStops.push(state.selectedStop.stop_id);
      }
    }

    if (action.type === 'toggle-trip-favorite') {
      nextState.favoriteTripToggleShouldAnimate = true;
      const currentTripKey = tripKey(state.selectedTrip);

      if (state.favoriteTrips.includes(currentTripKey)) {
        nextState.favoriteTrips = state.favoriteTrips.filter(favoriteTripKey => favoriteTripKey !== currentTripKey)
      }
      else {
        nextState.favoriteTrips.push(currentTripKey);
      }
    }

    if (action.type === 'toggle-trip-favorite-animation-end') {
      nextState.favoriteTripToggleShouldAnimate = false;
    }

    if (action.type === 'toggle-stop-favorite-animation-end') {
      nextState.favoriteStopToggleShouldAnimate = false;
    }

  });
}