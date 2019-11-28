import {BaseElement} from '../Core/BaseElement.js';
import {Store} from "../Core/Store.js";
import {html} from "../vendor/lighterhtml.js";
import {relativeTime} from "../Helpers/relativeTime.js";

/**
 * Returns an illustration which tells you, if you can wait, need to prepare, travel or that you have missed the trip.
 */
customElements.define('trip-indicator', class TripIndicator extends BaseElement {

  /**
   * When our custom element is placed inside the DOM.
   */
  connectedCallback() {
    this.draw();
    this.interval = setInterval(() => {
      this.draw();
    }, 1000)
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.interval)
  }

  /**
   * Our lighterHTML render function.
   * @returns {*}
   */
  draw() {
    const s = Store.getState().indicator;

    return html`
      
      <h1>${s.phase}</h1>
    
      ${s.phase === 'wait' ? html`
        <p>Je kunt nog ${relativeTime(s.leaveTimestamp, false)} wachten.</p>
      ` : ''}
    `
  }
});