/**
 * This file is a CustomElement but for convenience it is placed in the root of the application.
 * This is the starting file of this application.
 *
 * Created by Daniël Beeke
 */

import {BaseElement} from './Core/BaseElement.js';
import {Store} from './Core/Store.js';
import {html} from "./vendor/lighterhtml.js";
import {goOnline, goOffline} from './Actions/DeviceActions.js';

import './vendor/polyfill.js';

import './CustomElements/AppLoader.js';
import './CustomElements/AppError.js';
import './CustomElements/TripSelector.js';
import './CustomElements/TripInfo.js';
import './CustomElements/TripIndicator.js';

customElements.define('ov-app', class OvApp extends BaseElement {

  connectedCallback () {
    this.draw();
    this.watch('loadingScreen.isLoading', () => this.draw());
    window.addEventListener('online',  goOnline);
    window.addEventListener('offline',  goOffline);
  }

  draw () {
    const s = Store.getState().loadingScreen;
    const e = Store.getState().error;

    return html`
      <app-loader class="page ${s.isLoading && !e.message ? '' : 'hidden'}" />
      <div class="page ${s.isLoading || e.message ? 'hidden' : ''}">
        <trip-selector />      
        <trip-info />
        <trip-indicator />
      </div>
      <app-error class="page ${e.message ? '' : 'hidden'}" />
    `;
  }

});