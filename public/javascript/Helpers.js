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
  var radlon1 = Math.PI * lon1 / 180;
  var radlon2 = Math.PI * lon2 / 180;
  var theta = lon1 - lon2;
  var radtheta = Math.PI * theta / 180;
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;
  return dist
}

/**
 * Fetches busStops near a LatLng
 * @param lat
 * @param lon
 * @param limit
 * @returns {Promise}
 */
export let getBusStops = (lat, lon, limit = 5) => {
  return proxy(`https://ovzoeker.nl/api/stops/${lat},${lon}`).then(busStops => {
    busStops.forEach(busStop => {
      busStop.distance = calculateDistance(busStop.stop_lat, busStop.stop_lon, lat, lon);

      let nameSplit = busStop.stop_name.split(', ');
      nameSplit.shift();
      busStop.name = nameSplit.join(', ');
    });

    busStops.sort(function (a, b) {
      return a.distance - b.distance;
    });

    busStops = busStops.slice(0, limit);

    document.body.dispatchEvent(new CustomEvent('loading', { detail: 'busTrips' }));

    let promises = busStops.map(busStop => proxy(`https://ovzoeker.nl/api/arrivals/${busStop.stop_id}`)
      .then(response => busStop.arrivals = response.arrivals));

    return Promise.all(promises).then(() => busStops.filter(busStop => busStop.arrivals.length > 0));
  });
};

/**
 * Returns the geolocation in a Promise
 * @returns {Promise}
 */
export let getCurrentPosition = () => {
  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(position => {
      resolve(position)
    });
  });
};

/**
 * Returns a relative time string.
 * @param epoch
 * @param addPrefixOrSuffix
 * @returns {string}
 */
export let relativeTime = (epoch, addPrefixOrSuffix = true) => {
  const rtf = new Intl.RelativeTimeFormat('nl', {
    localeMatcher: "best fit",
    numeric: "auto",
    style: "long",
  });

  let pastOrFuture = epoch > new Date() / 1000 ? 'future' : 'past';

  let totalSeconds = Math.abs(epoch - (new Date() / 1000));
  let timeParts = [];

  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = Math.floor((totalSeconds % 3600) % 60);

  let cleaner = (string) => {
    return string.replace('over ', '').replace(' geleden', '').trim()
  };

  if (hours) {
    timeParts.push(rtf.format(hours, 'hour'));
  }

  if (minutes) {
    timeParts.push(rtf.format(minutes, 'minutes'));
  }

  if (seconds) {
    timeParts.push(rtf.format(seconds, 'seconds'));
  }

  let outputParts = [];
  if (pastOrFuture === 'future' && addPrefixOrSuffix) outputParts.push('Over ');

  timeParts.forEach((timePart, index) => {
    outputParts.push(cleaner(timePart));

    if (index === 0 && timeParts.length === 2 || index === 1 && timeParts.length === 3) outputParts.push(' en ');
    if (index === 0 && timeParts.length === 3) outputParts.push(', ');
  });

  if (pastOrFuture === 'past' && addPrefixOrSuffix) outputParts.push(' geleden');

  return outputParts.join('');
};
