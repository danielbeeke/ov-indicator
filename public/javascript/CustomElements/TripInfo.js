import {BaseElement} from '../Core/BaseElement.js';
import {Store} from "../Core/Store.js";
import {html} from "../vendor/lighterhtml.js";
import {relativeTime} from '../Core/Helpers.js';

/**
 * Returns a bit of information about the stop and the trip.
 */
customElements.define('trip-info', class TripInfo extends BaseElement {

  /**
   * When our custom element is placed inside the DOM.
   */
  connectedCallback() {
    this.draw();
    this.watch([
      'tripSelector.selectedStop',
      'tripSelector.selectedTrip'
    ], () => this.draw());
  }

  /**
   * Our lighterHTML render function.
   * @returns {*}
   */
  draw() {
    const s = Store.getState().tripSelector;
    const departureTime = new Date(s.selectedTrip.ts);

    return html`
      <div class="distance info-field">
        <label class="label">Afstand</label>
        <span class="value">${s.selectedStop.distance}m</span>
      </div>
      
      <div class="departure info-field">
        <label class="label">Vertrektijd</label>
        <span class="value">${relativeTime(s.selectedTrip.ts, true, 'short')}</span>
      </div>
    `
  }
});