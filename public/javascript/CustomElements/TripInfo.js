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
    const i = Store.getState().indicator;

    return html`
      ${s.selectedStop ? html`
        <div class="distance info-field">
          <label class="label">Afstand to halte</label>
          <span class="value">${s.selectedStop.distance} meter</span>
        </div>
      ` : ''}
      
      ${s.selectedTrip ? html`
        <div class="departure info-field">
          <label class="label">Vertrektijd van bus of trein</label>
          <span class="value">${relativeTime(s.selectedTrip.ts)}</span>
        </div>
      ` : ''}
      
      ${i.averageWalkInHours ? html`
        <div class="departure info-field">
          <label class="label">Gemiddelde wandeltijd</label>
          <span class="value">${Math.round(i.averageWalkInHours * 60)} minuten</span>
        </div>
      ` : ''}
    `
  }
});