import {getGeolocation, getStops, getTrips} from "../Actions/TripSelectorActions.js";
import {assertReducerShape, warning, getUnexpectedStateShapeWarningMessage, getUndefinedStateErrorMessage} from "../vendor/Redux.js";

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
  let radlat1 = Math.PI * lat1 / 180;
  let radlat2 = Math.PI * lat2 / 180;
  let theta = lon1 - lon2;
  let radtheta = Math.PI * theta / 180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;
  return Math.round(dist * 1000);
}

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

/**
 * A copy of combineReducers where the whole state is given as a third parameter to the reducers.
 * @param reducers
 * @returns {function(*=, *=): {}}
 */
export function sharedCombineReducers(reducers) {
  let reducerKeys = Object.keys(reducers);
  let finalReducers = {};

  for (let i = 0; i < reducerKeys.length; i++) {
    let key = reducerKeys[i];
    {
      if (typeof reducers[key] === 'undefined') {
        warning("No reducer provided for key \"" + key + "\"");
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  let finalReducerKeys = Object.keys(finalReducers); // This is used to make sure we don't warn about the same
  // keys multiple times.
  let unexpectedKeyCache;

  {
    unexpectedKeyCache = {};
  }

  let shapeAssertionError;

  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    {
      let warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);

      if (warningMessage) {
        warning(warningMessage);
      }
    }

    let hasChanged = false;
    let nextState = {};

    for (let _i = 0; _i < finalReducerKeys.length; _i++) {
      let _key = finalReducerKeys[_i];
      let reducer = finalReducers[_key];
      let previousStateForKey = state[_key];
      let nextStateForKey = reducer(previousStateForKey, action, state);

      if (typeof nextStateForKey === 'undefined') {
        let errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}

/**
 * Creates the indication.
 * @param state
 * @param now
 */
export function createIndication(state, now) {
  if (!state.tripSelector.selectedStop) { throw 'Missing selected stop' }
  if (!state.tripSelector.selectedTrip) { throw 'Missing selected trip' }

  const departureTime = state.tripSelector.selectedTrip.ts;
  const distance = state.tripSelector.selectedStop.distance;

  const averageWalkingSpeed = 5000;
  const fastWalkingSpeed = averageWalkingSpeed * 1.4;
  const slowWalkingSpeed = averageWalkingSpeed * 0.6;

  const slowWalkInHours = distance / slowWalkingSpeed;
  const averageWalkInHours = distance / averageWalkingSpeed;
  const fastWalkInHours = distance / fastWalkingSpeed;

  const timeLeft = departureTime - now;
  const prepareMarge = 60;

  let result = {};

  if (timeLeft > slowWalkInHours + prepareMarge) {
    // You can wait a little longer.
    result.phase = 'wait';
  }
  else if (timeLeft > slowWalkInHours) {
    // You should be preparing now, leave in 30 sec.
    result.phase = 'prepare';
  }
  else if (timeLeft > averageWalkInHours + 30 || timeLeft > fastWalkInHours) {
    // You should be walking or running now.
    result.phase = 'traveling';
  }
  else if (timeLeft < fastWalkInHours) {
    // You have missed the trip.
    result.phase = 'missed';
  }

  // These variables may be useful in the template.
  result.timeLeft = timeLeft;
  result.distance = distance;
  result.prepareMarge = prepareMarge;
  result.departureTime = departureTime;
  result.averageWalkingSpeed = averageWalkingSpeed;
  result.leaveTimestamp = departureTime - (averageWalkInHours * 60 * 60);
  result.averageWalkInHours = averageWalkInHours;

  return result;
}