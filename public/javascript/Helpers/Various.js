import {getGeolocation, getStops, getTrips} from "../Actions/TripSelectorActions.js";

/**
 * Proxy for fetching data
 * @returns {Promise}
 */
export const proxy = function () {
  arguments[0] = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(arguments[0])}`;
  return fetch(...arguments)
    .then(response => response.json())
};

/**
 * Returns the geolocation in a Promise
 * @returns {Promise<position>}
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => {
      resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    }, error => {
      reject(error.message)
    });
  });
};

/**
 * Returns whether the thing given is a Promise
 * @param obj
 * @returns {boolean}
 */
export function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

/**
 * Selects the arrivals from the tripSelector state.
 * @param tripSelector
 * @returns {*}
 */
export function currentArrivals (tripSelector) {
  if (tripSelector.selectedStop && tripSelector.trips) {
    const currentTrips = tripSelector.trips.find ? tripSelector.trips.find(trip => trip.stop.stop_id === tripSelector.selectedStop.stop_id) : false;
    if (currentTrips && currentTrips.arrivals.length) {
      return currentTrips.arrivals;
    }
  }
}

/**
 * Returns a trip identifier
 * @param trip
 * @returns {string}
 */
export const tripKey = (trip) => {
  return trip.route_short_name + '-' + trip.trip_headsign
};

/**
 * Triggers the main data loading action.
 * It fetches geolocation, stops and trips.
 */
export const loadGeolocationStopsAndTrips = (favoriteStops) => {
  getGeolocation().then(({lat, lng}) => {
    getStops(lat, lng, favoriteStops, 5).then(stops => getTrips(stops.map(stop => stop.stop_id)));
  });
};

