import * as Redux from './vendor/redux.min.js';
import {produce} from 'https://unpkg.com/immer@5.0.0/dist/immer.module.js';
import {calculateDistance} from "./Helpers.js";

/**
 * Redux reducer
 * @param state
 * @param action
 * @returns {{loadingPhase: string}|any}
 * @constructor
 */
function OvIndicatorStore (state, action = null) {

  /**
   * Initial state.
   */
  if (typeof state === 'undefined') {
    return {
      loadingPhase: '',
      busStops: [],
      lat: null,
      lng: null,
      animateToggleButtonBusStop: false,
      animateToggleButtonTrip: false,
      currentGeolocationWatcher: null,
      selectedBusStop: null,
      selectedTrip: null,
      favoriteBusStops: localStorage.getItem('favoriteBusStops') ? localStorage.getItem('favoriteBusStops').split(',') : [],
      favoriteTrips: localStorage.getItem('favoriteTrips') ? localStorage.getItem('favoriteTrips').split(',') : []
    }
  }

  return produce(state, draft => {
    if (action.type === 'loadingPhase') {
      draft.loadingPhase = action.args;
    }

    if (action.type === 'setBusStops') {
      draft.busStops = action.args;
    }

    if (action.type === 'updateDistancesBusStops') {
      draft.busStops.forEach(busStop => {
        busStop.distance = calculateDistance(busStop.stop_lat, busStop.stop_lon, draft.lat, draft.lng);
      });
    }

    if (action.type === 'sortBusStops') {
      draft.busStops.sort((a, b) => {
        let firstSort = draft.favoriteBusStops.includes(b.stop_id) - draft.favoriteBusStops.includes(a.stop_id);
        if (firstSort !== 0) { return firstSort }
        return a.distance - b.distance;
      });
    }

    if (action.type === 'updateGeolocation') {
      draft.lat = action.args.lat;
      draft.lng = action.args.lng;
    }

    if (action.type === 'setSelectedBusStop') {
      draft.selectedBusStop = action.args;
    }

    if (action.type === 'setSelectedTrip') {
      draft.selectedTrip = action.args;
    }

    if (action.type === 'changeBusStop') {
      draft.selectedBusStop = draft.busStops.find(busStop => busStop.stop_id === action.args);
      draft.selectedTrip = draft.selectedBusStop.trips[0];

      if (draft.currentGeolocationWatcher) {
        navigator.geolocation.clearWatch(draft.currentGeolocationWatcher);
      }

      draft.currentGeolocationWatcher = navigator.geolocation.watchPosition((position) => {
        Store.trigger('updateGeolocation', {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }, error => {}, {
        enableHighAccuracy: false,
        maximumAge: 100
      });
    }

    if (action.type === 'clearCurrentGeolocationWatcher') {
      navigator.geolocation.clearWatch(draft.currentGeolocationWatcher);
    }

    if (action.type === 'changeTrip') {
      draft.selectedTrip = draft.selectedBusStop.trips.find(trip => trip.trip_id === action.args);
    }

    if (action.type === 'setAnimateToggleButtonBusStop') {
      draft.animateToggleButtonBusStop = action.args;
    }

    if (action.type === 'removeFromFavoriteBusStops') {
      draft.favoriteBusStops = draft.favoriteBusStops.filter(busStopId => busStopId !== action.args);
      localStorage.setItem('favoriteBusStops', draft.favoriteBusStops.join(','));
    }

    if (action.type === 'addToFavoriteBusStops') {
      draft.favoriteBusStops.push(action.args);
      localStorage.setItem('favoriteBusStops', draft.favoriteBusStops.join(','));
    }

    if (action.type === 'setAnimateToggleButtonTrip') {
      draft.animateToggleButtonTrip = action.args;
    }

    if (action.type === 'removeFromFavoriteTrips') {
      draft.favoriteBusStops = this.favoriteTrips.filter(tripId => tripId !== action.args)
      localStorage.setItem('favoriteTrips', draft.favoriteTrips.join(','));
    }

    if (action.type === 'addToFavoriteTrips') {
      draft.favoriteTrips.push(action.args);
      localStorage.setItem('favoriteTrips', draft.favoriteTrips.join(','));
    }
  });
}

/**
 * The store class
 * With small helpers to make redux easier.
 */
class StoreClass {
  constructor () {
    this.redux = Redux.createStore(OvIndicatorStore,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    this.oldState = this.redux.getState();
    this.callbacks = {};

    this.redux.subscribe(() => {
      let newState = this.redux.getState();

      Object.keys(this.callbacks).forEach(key => {
        if (this.oldState[key] !== newState[key]) {
          this.callbacks[key].forEach(callback => callback(newState[key]))
        }
      });

      this.oldState = newState;
    });
  }

  trigger (action, args) {
    this.redux.dispatch({
      type: action,
      args: args
    });
  }

  watch (key, callback) {
    if (!this.callbacks[key]) this.callbacks[key] = [];
    this.callbacks[key].push(callback);
  }

  getState () {
    return this.redux.getState();
  }

}

/**
 * Export the store as a singleton.
 */
export const Store = new StoreClass();