import {produce} from './vendor/immer.js';
import * as StoreReducers from './StoreReducers.js';

export function RootStoreReducer (state, action = null) {

  /**
   * Initial state.
   */
  if (typeof state === 'undefined') {
    return {
      loadingPhase: '',
      busStops: [],
      lat: null,
      lng: null,
      currentGeolocationWatcher: null,
      selectedBusStop: null,
      selectedTrip: null,
      favoriteBusStops: localStorage.getItem('favoriteBusStops') ? localStorage.getItem('favoriteBusStops').split(',') : [],
      favoriteTrips: localStorage.getItem('favoriteTrips') ? localStorage.getItem('favoriteTrips').split(',') : []
    }
  }

  /**
   * The produce function helps with immutability, it is immer.js.
   */
  return produce(state, draft => {
    if (StoreReducers[action.type]) {
      StoreReducers[action.type](draft, action, state);
    }

    if (action.callback) {
      action.callback(draft)
    }
  });
}