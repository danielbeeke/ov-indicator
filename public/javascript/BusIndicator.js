import {BaseElement} from './BaseElement.js';
import {html} from './vendor/lighterhtml.js';
import {relativeTime, calculateIndication} from './Helpers.js';
import {Store} from "./Store.js";

customElements.define('bus-indicator', class BusIndicator extends BaseElement {
  constructor () {
    super();
    Store.watch('loadingPhase', (newPhase) => {
      if (newPhase === 'destroyed') this.classList.remove('hidden');
    });

    Store.watch('selectedTrip', () => {
      this.draw();
    });
  }

  draw () {
    let state = Store.getState();
    let calculation = calculateIndication(
      state.selectedBusStop ? state.selectedBusStop.distance : 0,
      state.selectedTrip ? state.selectedTrip.ts : 0
    );

    let remainingTime = relativeTime(new Date() / 1000 + (calculation.neededHours * 60 * 60));
    let tripLeave = state.selectedTrip ? relativeTime(state.selectedTrip.ts) : '';

    return html`
      ${state.selectedBusStop ? html`        
        <div>De bus vertrekt ${tripLeave.toLowerCase()}</div>
        <div>Bij gemiddelde snelheid ben je er ${remainingTime.toLowerCase()}</div>
      ` : ''}
    `
  }
});