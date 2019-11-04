import {calculateIndication} from './Helpers.js';

let now = new Date() / 1000;
for (let i = 0; i < 1100; i++) {
  calculateIndication(400, now + 1100, now + i);
}
