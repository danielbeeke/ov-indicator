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
 * Calculates distance in KM between two LatLng's
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @returns {number}
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  var radlat1 = Math.PI * lat1 / 180;
  var radlat2 = Math.PI * lat2 / 180;
  var theta = lon1 - lon2;
  var radtheta = Math.PI * theta / 180;
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;
  return Math.round(dist * 1000);
}

/**
 * Returns wheter the thing given is a Promise
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
  if (tripSelector.selectedStop) {
    const currentTrips = tripSelector.trips.find(trip => trip.stop.stop_id === tripSelector.selectedStop.stop_id);
    if (currentTrips && currentTrips.arrivals) {
      return currentTrips.arrivals;
    }
  }
}