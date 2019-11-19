import {Store} from '../Core/Store.js';
import {getCurrentPosition, proxy, calculateDistance} from "../Core/Helpers.js";

/**
 * Returns the current location
 * @returns {Promise<position>}
 */
export const getGeolocation = () => {
  const promise = getCurrentPosition();
  Store.dispatch({
    type: 'get-geolocation',
    payload: promise
  });
  return promise;
};

/**
 * Returns bus or train stops that are near.
 * @param lat
 * @param lng
 * @param limit
 * @returns []
 */
export const getStops = (lat, lng, limit = 5) => {
  const sortStops = (stops) => stops.sort((a, b) => a.distance - b.distance);
  const addDistances = (stops) => stops.forEach(stop => stop.distance = calculateDistance(stop.stop_lat, stop.stop_lon, lat, lng));
  const promise = proxy(`https://ovzoeker.nl/api/stops/${lat},${lng}`).then(stops => {
    addDistances(stops);
    stops = sortStops(stops);
    return stops.slice(0, limit);
  });

  Store.dispatch({
    type: 'get-stops',
    payload: promise
  });

  return promise;
};

/**
 * Returns trips for the near stops.
 * @param stopIds
 * @returns {Promise<[]>}
 */
export const getTrips = (stopIds) => {
  const promises = stopIds.map(stopId => proxy(`https://ovzoeker.nl/api/arrivals/${stopId}`));
  const allPromises = Promise.all(promises);

  Store.dispatch({
    type: 'get-trips',
    payload: allPromises
  });

  return allPromises;
};

/**
 * Sets the stop
 */
export const setStop = (stopId) => {
  Store.dispatch({
    type: 'set-stop',
    payload: {
      stopId: stopId
    }
  });
};

/**
 * Sets the trip
 */
export const setTrip = (tripId) => {
  Store.dispatch({
    type: 'set-trip',
    payload: {
      tripId: tripId
    }
  });
};

/**
 * Toggle stop favorite
 */
export const toggleStopFavorite = () => {
  Store.dispatch({
    type: 'toggle-stop-favorite'
  });
};

/**
 * Toggle trip favorite
 */
export const toggleTripFavorite = () => {
  Store.dispatch({
    type: 'toggle-trip-favorite'
  });
};