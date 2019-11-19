import {BaseElement} from '../Core/BaseElement.js';
import {Store} from "../Core/Store.js";
import {html} from "../vendor/lighterhtml.js";

customElements.define('trip-indicator', class TripIndicator extends BaseElement {

  /**
   * When our custom element is placed inside the DOM.
   */
  connectedCallback() {
    this.draw();
    // this.watch('', () => this.draw());
  }

  /**
   * Our lighterHTML render function.
   * @returns {*}
   */
  draw() {
    let s = Store.getState().loadingScreen;

    return html`

    `
  }
});