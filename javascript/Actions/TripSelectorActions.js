import {Store} from '../Core/Store.js';
import {getCurrentPosition, proxy} from "../Helpers/Various.js";
import {calculateDistance} from '../Helpers/CalculateDistance.js';
import {getGeoPermission} from './DeviceActions.js';

/**
 * Returns the current location
 * @returns {Promise<position>}
 */
export const getGeolocation = () => {
  const promise = getCurrentPosition();
  Store.dispatch({
    type: 'request-geolocation',
    payload: promise.then(result => {
      getGeoPermission();
      return result;
    })
  });

  return promise;
};

/**
 * Returns bus or train stops that are near.
 * @param lat
 * @param lng
 * @param favoriteStops
 * @param limit
 * @returns []
 */
export const getStops = (lat, lng, favoriteStops, limit = 5) => {
  const sortStops = (stops) => {
    return stops.sort((a, b) => {
      let firstSort = favoriteStops.includes(b.stop_id) - favoriteStops.includes(a.stop_id);
      if (firstSort !== 0) { return firstSort }

      let distanceA = calculateDistance(a.stop_lat, a.stop_lon, lat, lng);
      let distanceB = calculateDistance(b.stop_lat, b.stop_lon, lat, lng);

      return distanceA - distanceB
    });
  };
  const onlyActive = (stops) => stops.filter(stop => stop.active_stop);
  const promise = proxy(`https://ovzoeker.nl/api/stops/${lat},${lng}`).then(stops => {
    stops = onlyActive(stops);
    stops = sortStops(stops);
    return stops.slice(0, limit);
  });

  Store.dispatch({
    type: 'fetch-stops',
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
    type: 'fetch-trips',
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
export const toggleStopFavorite = (target) => {
  Store.dispatch({
    type: 'toggle-stop-favorite'
  });

  const button = target.closest('button');
  button.addEventListener('animationend', () => {
    Store.dispatch({
      type: 'toggle-stop-favorite-animation-end'
    });
  }, {once: true});
};

/**
 * Toggle trip favorite
 */
export const toggleTripFavorite = (target) => {
  Store.dispatch({
    type: 'toggle-trip-favorite'
  });

  const button = target.closest('button');
  button.addEventListener('animationend', () => {
    Store.dispatch({
      type: 'toggle-trip-favorite-animation-end'
    });
  }, {once: true});
};
