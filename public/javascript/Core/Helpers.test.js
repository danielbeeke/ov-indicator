import test from 'ava';
import {proxy, calculateDistance} from './Helpers.js';
import {fetchMock, busStops} from './FetcherTestHelper.js';

test('proxy', async t => {
  global.fetch = fetchMock;
  const promise = proxy('https://ovzoeker.nl/api/stops/52.212426082923855,5.995801068166348');
  t.is(await promise, busStops);
});

test('calculateDistance', t => {
  let distance = calculateDistance(52.253801, 6.21593082057636, 52.25001341850681, 6.21254809608018);
  t.is(distance, 480);
});
