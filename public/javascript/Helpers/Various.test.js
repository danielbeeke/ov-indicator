import test from 'ava';
import {proxy, calculateDistance, isPromise} from './Various.js';
import {fetchMock, busStops} from '../Core/FetcherTestHelper.js';

test('proxy', async t => {
  global.fetch = fetchMock;
  const promise = proxy('https://ovzoeker.nl/api/stops/52.212426082923855,5.995801068166348');
  t.is(await promise, busStops);
});

test('calculateDistance', t => {
  let distance = calculateDistance(52.253801, 6.21593082057636, 52.25001341850681, 6.21254809608018);
  t.is(distance, 480);
});

test('isPromise', t => {
  t.is(isPromise({}), false);
  t.is(isPromise(Promise.resolve()), true);
  t.is(isPromise(''), false);
});
