import {BaseElement} from '../Core/BaseElement.js';
import {Store} from "../Core/Store.js";
import {html} from "../vendor/lighterhtml.js";
import {relativeTime} from '../Helpers/RelativeTime.js';
import {calculateDistance} from '../Helpers/CalculateDistance.js';

/**
 * Returns a bit of information about the stop and the trip.
 */
customElements.define('trip-info', class TripInfo extends BaseElement {

  /**
   * When our custom element is placed inside the DOM.
   */
  connectedCallback() {
    this.watch([
      'tripSelector.selectedStop',
      'tripSelector.selectedTrip'
    ], () => {this.draw()})

    this.interval = setInterval(() => {
      this.draw();
    }, 1000);
  }

  /**
   * Our lighterHTML render function.
   * @returns {*}
   */
  draw() {
    const t = Store.getState().tripSelector;
    const i = Store.getState().indicator;
    const d = Store.getState().device;

    const punctuality = t.selectedTrip && t.selectedTrip.punctuality ? t.selectedTrip.punctuality : false;
    let distance = t.selectedStop ? calculateDistance(t.selectedStop.stop_lat, t.selectedStop.stop_lon, d.lat, d.lng) : null;
    let walkInMinutes = Math.round(distance / i.averageWalkingSpeed * 60);

    return html`
      ${distance ? html`
        <div class="distance info-field">
          <label class="label">Afstand</label>
          <span class="value">${distance} m.</span>
        </div>
      ` : ''}
      
      ${t.selectedTrip ? html`
        <div class="departure info-field">
          <label class="label">Vertrektijd bus</label>
          <span class="value">${relativeTime(t.selectedTrip.ts, true, 'short')}</span>
        </div>
      ` : ''}

      ${punctuality ? html`
        <div class="punctuality info-field ${punctuality < 0 ? 'negative' : ''} ${t.selectedTrip.punctuality > 40 ? 'early' : ''}">
          ${punctuality < 0 ? html`
            <label class="label">Te laat</label>
          ` : ''}
          ${punctuality > 40 ? html`
            <label class="label">Te vroeg</label>
          ` : ''}
          ${punctuality < 30 && punctuality >= 0 ? html`
            <label class="label">Op tijd</label>
          ` : ''}
          <span class="value">${relativeTime(Date.now() / 1000 + (punctuality), false)}</span>
        </div>
      ` : ''}
      
      ${walkInMinutes ? html`
        <div class="departure info-field">
          <label class="label">Wandeltijd</label>
          <span class="value">${walkInMinutes} min.</span>
        </div>
      ` : ''}

      ${walkInMinutes && t.selectedTrip ? html`
        <div class="departure info-field">
          <label class="label">Jouw vertrektijd</label>
          <span class="value">${relativeTime(t.selectedTrip.ts - (walkInMinutes * 60 + i.prepareMinutes * 60), true, 'short')}</span>
        </div>
      ` : ''}

    `
  }
});