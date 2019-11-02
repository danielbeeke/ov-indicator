import {BaseElement} from './BaseElement.js';
import {html} from './vendor/lighterhtml.js';

customElements.define('bus-indicator', class BusIndicator extends BaseElement {
  constructor () {
    super();
    this.attachEvents();
    this.kilometerPerHour = 4;
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
      this.calculateIndicator();
    });
  }

  connectedCallback () {
    this.draw();
  }

  calculateIndicator () {
    this.neededKilometerPerHour = this.busStop.distance / 1000;

    console.log(this.neededKilometerPerHour, this.kilometerPerHour)
    console.log(this.neededKilometerPerHour / 60 / 60 * 1000, this.kilometerPerHour / 60 / 60 * 1000)
    this.draw();
  }

  draw () {


    return html`

      ${this.busStop ? html`
        <span>${this.busStop.distance} meter</span>      
      ` : ''}
    `
  }
});