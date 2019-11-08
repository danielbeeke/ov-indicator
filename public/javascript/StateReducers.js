import {calculateDistance} from './Helpers.js';
import {Store} from './Store.js';

/**
 * Loading screen
 */
export let loadingPhase = (state, action) => state.loadingPhase = action.args;

/**
 * Bus and trip selector
 */
export let setBusStops = (state, action) => state.busStops = action.args;
export let updateDistancesBusStops = (state) => {
  state.busStops.forEach(busStop => {
    busStop.distance = calculateDistance(busStop.stop_lat, busStop.stop_lon, state.lat, state.lng);
  });
};
export let sortBusStops = (state) => {
  state.busStops.sort((a, b) => {
    let firstSort = state.favoriteBusStops.includes(b.stop_id) - state.favoriteBusStops.includes(a.stop_id);
    if (firstSort !== 0) { return firstSort }
    return a.distance - b.distance;
  });
};
export let updateGeolocation = (state, action) => {
  state.lat = action.args.lat;
  state.lng = action.args.lng;
};
export let setSelectedBusStop = (state, action) => state.selectedBusStop = action.args;
export let setSelectedTrip = (state, action) => state.selectedTrip = action.args;
export let changeBusStop = (state, action) => {
  state.selectedBusStop = state.busStops.find(busStop => busStop.stop_id === action.args);
  state.selectedTrip = state.selectedBusStop.trips[0];

  if (state.currentGeolocationWatcher) {
    navigator.geolocation.clearWatch(state.currentGeolocationWatcher);
  }

  state.currentGeolocationWatcher = navigator.geolocation.watchPosition((position) => {
    Store.trigger('updateGeolocation', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  }, error => {}, {
    enableHighAccuracy: false,
    maximumAge: 100
  });
};
export let clearCurrentGeolocationWatcher = (state) =>  navigator.geolocation.clearWatch(state.currentGeolocationWatcher);
export let changeTrip = (state, action) => state.selectedTrip = state.selectedBusStop.trips.find(trip => trip.trip_id === action.args);

/**
 * Logic for making a trip or a busStop favorite.
 */
export let addToFavoriteBusStops = (state, action) => {
  state.favoriteBusStops.push(action.args);
  localStorage.setItem('favoriteBusStops', state.favoriteBusStops.join(','));
};
export let removeFromFavoriteBusStops = (state, action) => {
  state.favoriteBusStops = state.favoriteBusStops.filter(busStopId => busStopId !== action.args);
  localStorage.setItem('favoriteBusStops', state.favoriteBusStops.join(','));
};
export let toggleItemFromFavoriteBusStops = (state, action, realState) => {
  let newTrigger = realState.favoriteBusStops.includes(state.selectedBusStop.stop_id) ? removeFromFavoriteBusStops : addToFavoriteBusStops;
  newTrigger(state, {
    args: realState.selectedBusStop.stop_id
  });
};
export let addToFavoriteTrips = (state, action) => {
  state.favoriteTrips.push(action.args);
  localStorage.setItem('favoriteTrips', state.favoriteTrips.join(','));
};
export let removeFromFavoriteTrips = (state, action) => {
  state.favoriteTrips = state.favoriteTrips.filter(tripId => tripId !== action.args);
  localStorage.setItem('favoriteTrips', state.favoriteTrips.join(','));
};

export let toggleItemFromFavoriteTrips = (state, action, realState) => {
  let newTrigger = realState.favoriteTrips.includes(state.favoriteTrips.route_short_name) ? removeFromFavoriteTrips : addToFavoriteTrips;
  newTrigger(state, {
    args: state.selectedTrip.route_short_name
  });
};