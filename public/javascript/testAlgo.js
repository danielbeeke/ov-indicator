import {calculateIndication} from './Helpers.js';

let now = new Date() / 1000;
for (let i = 0; i < 400; i++) {
  calculateIndication(400, now + 1100, now + (i * 2));
}
