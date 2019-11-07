import {BaseElement} from './BaseElement.js';
import {html} from './vendor/lighterhtml.js';
import {relativeTime, calculateIndication} from './Helpers.js';

customElements.define('bus-indicator', class BusIndicator extends BaseElement {
  constructor () {
    super();
    this.attachEvents();
  }

  /**
   * Attaches events to events of other components.
   */
  attachEvents () {
    document.body.addEventListener('loading', event => {
      if (event.detail === 'destroyed') this.classList.remove('hidden')
    });

    document.body.addEventListener('selectedData', event => {
      Object.assign(this, event.detail);
      this.draw();
    });
  }

  connectedCallback () {
    this.draw();

    this.interval = setInterval(() => {
      this.draw();
    }, 1000);
  }

  draw () {
    Object.assign(this, {
      neededHours: null,
      indication: null,
      phase: null
    }, calculateIndication(this.busStop ? this.busStop.distance : 0, this.trip ? this.trip.ts : 0));

    this.remainingTime = relativeTime(new Date() / 1000 + (this.neededHours * 60 * 60));
    this.tripLeave = this.trip ? relativeTime(this.trip.ts) : '';

    return html`

      ${this.busStop ? html`
        <div class="indicator-progress-bar">
            <div class="wrapper">
              <div class="indicator-progress-bar-item">1</div>        
              <div class="indicator-progress-bar-item">2</div>        
              <div class="indicator-progress-bar-item">3</div>        
              <div class="indicator-progress-bar-item">4</div>        
              <div class="indicator-progress-bar-item">5</div>        
            </div>
            <div class="indicator" style="left: ${this.indication}%;"></div>
        </div>
        
        <div>De bus vertrekt ${this.tripLeave.toLowerCase()}</div>
        <div>Bij gemiddelde snelheid ben je er ${this.remainingTime.toLowerCase()}</div>
      ` : ''}
    `
  }
});