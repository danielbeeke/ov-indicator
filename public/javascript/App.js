import './BusLoader.js';

let loader = document.createElement('bus-loader');
document.body.appendChild(loader);

document.body.dispatchEvent(new CustomEvent('loading', { detail: 'boot' }));

import('./BusIndicator.js').then(() => {
  let busIndicator = document.createElement('bus-indicator');
  document.body.appendChild(busIndicator);
});