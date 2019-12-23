/**
 * This file is a CustomElement but for convenience it is placed in the root of the application.
 * This is the starting file of this application.
 *
 * Created by Daniël Beeke
 */

import {BaseElement} from './Core/BaseElement.js';
import {Store} from './Core/Store.js';
import {html} from "./vendor/lighterhtml.js";
import {goOnline, goOffline, getGeoPermission} from './Actions/DeviceActions.js';
import {loadGeolocationStopsAndTrips} from './Helpers/Various.js';

import './vendor/polyfill.js';

import './CustomElements/AppMenu.js';
import './CustomElements/AppLoader.js';
import './CustomElements/AppError.js';
import './CustomElements/TripSelector.js';
import './CustomElements/TripInfo.js';
import './CustomElements/TripIndicator.js';

customElements.define('ov-app', class OvApp extends BaseElement {

  /**
   * This is the main startup function of the app.
   */
  connectedCallback () {
    window.addEventListener('online',  goOnline);
    window.addEventListener('offline',  goOffline);

    getGeoPermission();

    // The next line/check is added for when the state is hydrated.
    const {selectedStop} = Store.getState().tripSelector;
    const {favoriteStops} = Store.getState().tripSelector;
    if (!selectedStop) loadGeolocationStopsAndTrips(favoriteStops);

    this.draw();
    this.watch([
      'loadingScreen.isLoading',
      'menu.expanded'
    ], () => this.draw());
  }

  draw () {
    const s = Store.getState().loadingScreen;
    const e = Store.getState().error;
    const m = Store.getState().menu;

    return html`
      <app-loader class="page ${s.isLoading && !e.message ? '' : 'hidden'}" />
      <div class="${m.expanded ? 'menu-expanded' : ''} page ${s.isLoading || e.message ? 'hidden' : ''}">
        <trip-selector />      
        <trip-info />
        <trip-indicator />    
      </div>
      <app-error class="page ${e.message ? '' : 'hidden'}" />
      <app-menu class="${m.expanded ? 'expanded' : ''}  ${s.isLoading || e.message ? 'hidden' : '' }" />
    `;
  }

});