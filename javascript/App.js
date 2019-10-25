import './BusLoader.js';

let loader = document.createElement('bus-loader');
document.body.appendChild(loader);

document.body.dispatchEvent(new CustomEvent('loading', { detail: 'boot' }));

import('./BusSelector.js').then(() => {
  let busIndicator = document.createElement('bus-selector');
  busIndicator.classList.add('hidden');
  document.body.appendChild(busIndicator);
});