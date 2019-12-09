import test from 'ava';
import {relativeTime} from './RelativeTime.js';

/**
 * Unfortunately node does not have the internationalisation file for dutch,
 * that is why the output differs for the test and app.
 */
test('relativeTime', t => {
  let a = relativeTime(1574806399, true, 'long', 1574806399);
  t.is(a, 'nu');
  let b = relativeTime(1574806899, true, 'long', 1574806399);
  t.is(b, 'Over 8 min, 20 s');
  let c = relativeTime(1574806899, true, 'short', 1574806399);
  t.is(c, 'Over 8 min');
  let d = relativeTime(1574806299, true, 'long', 1574806999);
  t.is(d, '11 min, 40 s geleden');
});
