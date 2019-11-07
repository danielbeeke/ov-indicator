import {BaseElement} from './BaseElement.js';
import {html} from './vendor/lighterhtml.js';
import {relativeTime, calculateIndication} from './Helpers.js';
import {Store} from "./Store.js";

customElements.define('bus-indicator', class BusIndicator extends BaseElement {
  constructor () {
    super();
    this.attachEvents();
  }

  /**
   * Attaches events to events of other components.
   */
  attachEvents () {
    Store.watch('loadingPhase', (newPhase) => {
      if (newPhase === 'destroyed') this.classList.remove('hidden');
    });

    Store.watch('selectedBusStop', () => {
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
        <div class="indicator-progress-bar">
            <div class="wrapper">
              <div class="indicator-progress-bar-item">1</div>        
              <div class="indicator-progress-bar-item">2</div>        
              <div class="indicator-progress-bar-item">3</div>        
              <div class="indicator-progress-bar-item">4</div>        
              <div class="indicator-progress-bar-item">5</div>        
            </div>
            <div class="indicator" style="left: ${calculation.indication}%;"></div>
        </div>
        
        <div>De bus vertrekt ${tripLeave.toLowerCase()}</div>
        <div>Bij gemiddelde snelheid ben je er ${remainingTime.toLowerCase()}</div>
      ` : ''}
    `
  }
});