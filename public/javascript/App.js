import './BusLoader.js';
import {Store} from './Store.js';

/**
 * The application starts by loading the bare minimum and later on importing modules and emitting the loading status to the preloader.
 */

let loader = document.createElement('bus-loader');
document.body.appendChild(loader);
Store.trigger('loadingPhase', 'boot');

/**
 * Import the selects and finally the indicator.
 */
import('./BusSelector.js').then(() => {
  let busSelector = document.createElement('bus-selector');
  busSelector.classList.add('hidden');
  document.body.appendChild(busSelector);

  import('./BusIndicator.js').then(() => {
    let busIndicator = document.createElement('bus-indicator');
    busIndicator.classList.add('hidden');
    document.body.appendChild(busIndicator);
  });
});