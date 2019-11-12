import {produce} from './vendor/immer.js';

export function State (state, action = null) {

  /**
   * Initial state.
   */
  if (typeof state === 'undefined') {
    return {
      page: 'loader',
      loadingPhase: {
        name: 'boot',
        percentage: 5,
        texts: ['Programma starten', 'Booting skynet...', 'Hello', 'Busje komt zo...']
      },
      busStops: [],
      trips: [],
      lat: null,
      lng: null,
      currentGeolocationWatcher: null,
      selectedBusStop: null,
      selectedTrips: null,
      selectedTrip: null,
      favoriteBusStops: localStorage.getItem('favoriteBusStops') ? localStorage.getItem('favoriteBusStops').split(',') : [],
      favoriteTrips: localStorage.getItem('favoriteTrips') ? localStorage.getItem('favoriteTrips').split(',') : []
    }
  }

  /**
   * The produce function helps with immutability, it is immer.js.
   */
  return produce(state, draft => {
    // Transactions in the code flow.
    if (action.callback) {
      action.callback(draft)
    }
  });
}