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
 * @param lon
 * @param limit
 * @returns {Promise<busStops>}
 */
export let getBusStops = (lat, lon, limit = 5) => {
  return proxy(`https://ovzoeker.nl/api/stops/${lat},${lon}`).then(busStops => {
    busStops.forEach(busStop => {
      busStop.distance = calculateDistance(busStop.stop_lat, busStop.stop_lon, lat, lon);

      if (busStop.stop_name.split(', ').length > 1) {
        let nameSplit = busStop.stop_name.split(', ');
        nameSplit.shift();
        busStop.name = nameSplit.join(', ');
      }
      else {
        busStop.name = busStop.stop_name;
      }
    });

    busStops.sort(function (a, b) {
      return a.distance - b.distance;
    });

    busStops = busStops.slice(0, limit);

    let promises = busStops.map(busStop => proxy(`https://ovzoeker.nl/api/arrivals/${busStop.stop_id}`)
      .then(response => busStop.trips = response.arrivals));

    return Promise.all(promises).then(() => busStops.filter(busStop => busStop.trips.length > 0));
  });
};

/**
 * Returns the geolocation in a Promise
 * @returns {Promise<position>}
 */
export let getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => {
      resolve(position)
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
