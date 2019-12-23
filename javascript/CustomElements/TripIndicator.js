import {BaseElement} from '../Core/BaseElement.js';
import {Store} from "../Core/Store.js";
import {html} from "../vendor/lighterhtml.js";
import {getPhase} from '../Helpers/GetPhase.js';
import {calculateDistance} from '../Helpers/CalculateDistance.js';

/**
 * Returns an illustration which tells you, if you can wait, need to prepare, travel or that you have missed the trip.
 */
customElements.define('trip-indicator', class TripIndicator extends BaseElement {

  connectedCallback() {
    this.draw();
    this.watch([
      'tripSelector.selectedStop',
      'tripSelector.selectedTrip'
    ], () => {this.draw()});
    this.interval = setInterval(() => {
      this.draw();
    }, 1000);
  }

  draw() {
    const d = Store.getState().device;
    const t = Store.getState().tripSelector;
    const i = Store.getState().indicator;

    let distance = t.selectedStop ? calculateDistance(t.selectedStop.stop_lat, t.selectedStop.stop_lon, d.lat, d.lng) : null;
    let phase = t.selectedTrip ? getPhase(t.selectedTrip.ts, distance, t.selectedTrip.punctuality, i.averageWalkingSpeed, i.prepareMinutes) : '';

    return html`
      ${phase === 'arrived' ? html`
        <p>Je bent gearriveerd.</p>
        <img src="/img/done.svg" class="illustration">
      ` : ''}

      ${phase === 'wait' ? html`
        <p>Je kunt nog wachten.</p>
        <img src="/img/coffee.svg" class="illustration">
      ` : ''}

      ${phase === 'prepare' ? html`
        <p>Doe je jas maar aan, als je nu weg gaat ben je mooi op tijd.</p>
        <img src="/img/leave.svg" class="illustration">
      ` : ''}

      ${phase === 'traveling' ? html`
        <p>Lekker wandelen of toch maar rennen?</p>
        <img src="/img/travel.svg" class="illustration">
      ` : ''}
      
      ${phase === 'missed' ? html`
        <p>Helaas, je was niet op tijd.</p>
        <img src="/img/late.svg" class="illustration">
      ` : ''}
    `
  }
});