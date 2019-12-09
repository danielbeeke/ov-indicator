export let busStops = JSON.parse('{"arrivals":[{"punctuality":69,"route_short_name":"Sprinter","trip_headsign":"Apeldoorn","trip_id":"90629162","ts":1574704869,"type":"actual","vehicle_id":"NS:7068"},{"punctuality":0,"route_short_name":"Sprinter","trip_headsign":"Apeldoorn","trip_id":"90655296","ts":1574706600,"type":"scheduled"},{"punctuality":0,"route_short_name":"Sprinter","trip_headsign":"Apeldoorn","trip_id":"90646011","ts":1574708400,"type":"scheduled"},{"punctuality":0,"route_short_name":"Sprinter","trip_headsign":"Apeldoorn","trip_id":"90645314","ts":1574710200,"type":"scheduled"},{"punctuality":0,"route_short_name":"Sprinter","trip_headsign":"Apeldoorn","trip_id":"90626514","ts":1574713800,"type":"scheduled"}],"stop":{"location_type":"0","parent_station":"stoparea:18195","persistent_id":"03aa20a661ef2e98850c0006b2b2525f","platform_code":"2","stop_id":"55089","stop_lat":"52.2383621142","stop_lon":"6.10056638718","stop_name":"Twello","zone_id":"IFF:twl"}}');

let urlMapping = {
  'https://api.codetabs.com/v1/proxy?quest=https%3A%2F%2Fovzoeker.nl%2Fapi%2Fstops%2F52.212426082923855%2C5.995801068166348' : busStops
};

export function fetchMock(url) {
  return new Promise((resolve, reject) => {
    resolve({
      json: () => urlMapping[url]
    });
  });
}