import {produce} from "../vendor/immer.js";

/**
 * Holds information about the stops and trips, is a Redux reducer
 */
export function tripSelectorReducer (state = {
  stops: [],
  trips: [],
  selectedStop: null,
  selectedTrip: null,
  favoriteStops: localStorage.getItem('favoriteStops') ? JSON.parse(localStorage.getItem('favoriteStops')) : [],
  favoriteTrips: localStorage.getItem('favoriteTrips') ? JSON.parse(localStorage.getItem('favoriteTrips')) : []
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
      const trips = action.payload;
      nextState.trips = trips;

      const currentArrivals = trips.find(trip => trip.stop.stop_id === state.selectedStop.stop_id).arrivals;
      if (!state.selectedTrip || !currentArrivals.find(arrival => arrival.trip_id === state.selectedTrip.trip_id)) {
        nextState.selectedTrip = currentArrivals[0];
      }
    }

  });
}