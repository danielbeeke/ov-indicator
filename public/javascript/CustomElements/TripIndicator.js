import {BaseElement} from '../Core/BaseElement.js';
import {Store} from "../Core/Store.js";
import {html} from "../vendor/lighterhtml.js";

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
    }, 1000);
  }

  /**
   * Our lighterHTML render function.
   * @returns {*}
   */
  draw() {
    const s = Store.getState().indicator;

    return html`
      ${s.phase === 'wait' ? html`
        <p>Je kunt nog wachten.</p>
      ` : ''}

      ${s.phase === 'prepare' ? html`
        <p>Doe je jas maar aan, als je nu weg gaat ben je mooi op tijd.</p>
      ` : ''}

      ${s.phase === 'traveling' ? html`
        <p>Lekker wandelen of toch maar rennen?</p>
      ` : ''}
      
      ${s.phase === 'missed' ? html`
        <p>Helaas, je was niet op tijd.</p>
      ` : ''}
    `
  }
});