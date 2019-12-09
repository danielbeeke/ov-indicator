import {BaseElement} from '../Core/BaseElement.js';
import {Store} from "../Core/Store.js";
import {html} from "../vendor/lighterhtml.js";
import {relativeTime} from '../Helpers/RelativeTime.js';

/**
 * Returns a bit of information about the stop and the trip.
 */
customElements.define('trip-info', class TripInfo extends BaseElement {

  /**
   * When our custom element is placed inside the DOM.
   */
  connectedCallback() {
    this.interval = setInterval(() => {
      this.draw();
    }, 1000);
  }

  /**
   * Our lighterHTML render function.
   * @returns {*}
   */
  draw() {
    const s = Store.getState().tripSelector;
    const i = Store.getState().indicator;

    return html`
      ${i.distance ? html`
        <div class="distance info-field">
          <label class="label">Afstand</label>
          <span class="value">${i.distance} m.</span>
        </div>
      ` : ''}
      
      ${s.selectedTrip ? html`
        <div class="departure info-field">
          <label class="label">Vertrektijd bus</label>
          <span class="value">${relativeTime(s.selectedTrip.ts, true, 'short')}</span>
        </div>
      ` : ''}
      
      ${i.walkInMinutes ? html`
        <div class="departure info-field">
          <label class="label">Wandeltijd</label>
          <span class="value">${i.walkInMinutes} min.</span>
        </div>
      ` : ''}
    `
  }
});