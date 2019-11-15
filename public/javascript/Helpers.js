/**
 * Proxy for fetching data
 * @returns {Promise}
 */
export let proxy = function () {
  arguments[0] = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(arguments[0])}`;
  return fetch(...arguments)
    .then(response => response.json())
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
 * Fetches busStops near a LatLng
 * @param lat
 * @param lng
 * @param limit
 * @returns {Promise<busStops>}
 */
export let getBusStops = (lat, lng, limit = 5, favorites = []) => {
  return proxy(`https://ovzoeker.nl/api/stops/${lat},${lng}`).then(busStops => {
    enhanceBusStopNames(busStops);
    setDistancesToBusStops(busStops, lat, lng);
    busStops = sortBusStopsByFavoritesAndDistance(busStops, favorites);
    return busStops.slice(0, limit);
  });
};

/**
 * Adds distances to the busStops.
 * @param busStops
 * @param lat
 * @param lng
 */
export let setDistancesToBusStops = (busStops, lat, lng) => {
  busStops.forEach(busStop => {
    busStop.distance = calculateDistance(busStop.stop_lat, busStop.stop_lon, lat, lng);
  });
};

/**
 * Returns trips by bus stop
 * @param id
 * @returns {Promise}
 */
export let getTripsByStop = (id) => {
  return proxy(`https://ovzoeker.nl/api/arrivals/${id}`)
    .then(response => response.arrivals);
};

/**
 * Enhances the bus stop names.
 * @param busStops
 */
export let enhanceBusStopNames = (busStops) => {
  busStops.forEach(busStop => {
    if (busStop.stop_name.split(', ').length > 1) {
      let nameSplit = busStop.stop_name.split(', ');
      nameSplit.shift();
      busStop.name = nameSplit.join(', ');
    }
    else {
      busStop.name = busStop.stop_name;
    }
  });
};

/**
 * Sorts the busStops by favorites and distance.
 * @param busStops
 * @param favoriteBusStops
 */
export let sortBusStopsByFavoritesAndDistance = (busStops, favoriteBusStops = []) => {
  busStops = [...busStops];

  busStops.sort((a, b) => {
    let firstSort = favoriteBusStops.includes(b.stop_id) - favoriteBusStops.includes(a.stop_id);
    if (firstSort !== 0) { return firstSort }
    return a.distance - b.distance;
  });

  return busStops;
};

/**
 * Returns the geolocation in a Promise
 * @returns {Promise<position>}
 */
export let getCurrentPosition = () => {
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
 * Returns a relative time string.
 * @param epoch
 * @param addPrefixOrSuffix
 * @param style
 * @returns {string}
 */
export let relativeTime = (epoch, addPrefixOrSuffix = true, style = 'long') => {
  const cleaner = (string) => string.replace('over ', '').replace(' geleden', '').trim();
  const pastOrFuture = epoch > new Date() / 1000 ? 'future' : 'past';

  const lf = new Intl.ListFormat('nl', { style: 'long', type: 'conjunction' });
  const rtf = new Intl.RelativeTimeFormat('nl', {
    localeMatcher: "best fit",
    numeric: "auto",
    style: style,
  });

  const totalSeconds = Math.abs(epoch - (new Date() / 1000));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor((totalSeconds % 3600) % 60);

  let timeParts = [];
  if (hours) timeParts.push(cleaner(rtf.format(hours, 'hour')));
  if (minutes) timeParts.push(cleaner(rtf.format(minutes, 'minutes')));
  if (seconds) timeParts.push(cleaner(rtf.format(seconds, 'seconds')));

  let output = lf.format(timeParts);
  if (pastOrFuture === 'future' && addPrefixOrSuffix) output = 'Over ' + output;
  if (pastOrFuture === 'past' && addPrefixOrSuffix) output = output + ' geleden';

  return output;
};

/**
 * Used to give an indication
 * TODO convert to separate pages.
 * @param distance
 * @param departmentTime
 * @param now
 * @returns {{phase: *, neededHours: *, indication: *}}
 */
export let calculateIndication = (distance, departmentTime, now = new Date() / 1000) => {
  let defaultWalkingSpeed = 4;
  let distanceInHours = distance / 1000 / defaultWalkingSpeed;
  let distanceInSeconds = distanceInHours * 60 * 60;
  let remainingSeconds = departmentTime - now;
  let preparationTime = 90;
  let coffeeTime = 360;
  let coffeeTimeEnd = 60;

  let runningFactor = 2;
  let fastWalkingFactor = 1.;
  let indication = 0;
  let phase = 0;

  // Phase 1, 0/20. Drinking coffee.
  if (remainingSeconds >= distanceInSeconds + preparationTime + coffeeTimeEnd) {
    phase = 1;

    let waitingTime = remainingSeconds - (distanceInSeconds + preparationTime);
    if (waitingTime > coffeeTime + coffeeTimeEnd) {
      indication = 0;
    }
    else {
      indication = Math.round(20 - 20 / (coffeeTime + coffeeTimeEnd) * waitingTime);
    }
  }

  // Phase 2, 20/40. Starting to leave the house.
  else if (remainingSeconds >= distanceInSeconds + coffeeTimeEnd) {
    phase = 2;

    let fraction = remainingSeconds - distanceInSeconds - coffeeTimeEnd;
    let addition = 20 / 100 * (preparationTime - fraction);
    indication = Math.round(20 + addition);
  }

  // Phase 3, 40/60. Should be walking.
  else if (remainingSeconds * fastWalkingFactor > distanceInSeconds) {
    phase = 3;

    let fraction = remainingSeconds * fastWalkingFactor - distanceInSeconds;
    let addition = 20 / fraction;
    indication = Math.round(40 + addition);
  }
  else if (remainingSeconds * runningFactor > distanceInSeconds) {
    phase = 4;

    let fraction = remainingSeconds * runningFactor - distanceInSeconds;
    let addition = 20 / fraction;
    indication = Math.round(60 + (addition * 2));
  }
  else {
    phase = 5;
    indication = 95;
  }

  return {
    neededHours: distanceInHours,
    indication: indication,
    phase: phase
  }
};

/**
 * Helpers for using objects via dot notation.
 *
 * @param obj
 * @param is
 * @param value
 * @returns {*}
 */
export function index(obj, is, value) {
  if (typeof is == 'string')
    return index(obj, is.split('.'), value);
  else if (is.length === 1 && value !== undefined)
    return obj[is[0]] = value;
  else if (is.length === 0)
    return obj;
  else
    return index(obj[is[0]], is.slice(1), value);
}

/**
 * Generic debounce function.
 *
 * @param func
 * @param wait
 * @param immediate
 * @returns {Function}
 */
export function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this, args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Logs all actions and states after they are dispatched.
 */
export const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  // return result
};
