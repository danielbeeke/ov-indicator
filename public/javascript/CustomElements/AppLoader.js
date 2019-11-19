import {BaseElement} from '../Core/BaseElement.js';
import {html} from '../vendor/lighterhtml.js';
import {Store} from '../Core/Store.js';
import {getGeolocation, getStops, getTrips} from "../Actions/TripSelectorActions.js";

/**
 * Shows a progressbar showing the loading progress of the app.
 */
customElements.define('app-loader', class AppLoader extends BaseElement {

  /**
   * When our custom element is placed inside the DOM.
   */
  connectedCallback() {
    this.watch('loadingScreen.phase', () => this.draw());
    const {selectedStop} = Store.getState().tripSelector;

    if (!selectedStop) {
      getGeolocation().then(() => {
        const {favoriteStops} = Store.getState().tripSelector;
        const {lat, lng} = Store.getState().device;
        getStops(lat, lng, favoriteStops, 5).then(stops => getTrips(stops.map(stop => stop.stop_id)));
      });
    }
  }

  /**
   * Our lighterHTML render function.
   * @returns {*}
   */
  draw() {
    const s = Store.getState().loadingScreen;

    return html`
      <div class="progress-bar-wrapper${s.phase === ' done' ? 'done' : ''}">
        <div class="progress-bar" style="width: ${s.percentage}%"></div>
        <div class="label">${s.text}</div>
      </div>
    `
  }
});