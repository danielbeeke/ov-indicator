import {BaseElement} from '../Core/BaseElement.js';
import {html} from '../vendor/lighterhtml.js';
import {Store} from '../Core/Store.js';
import {loadGeolocationStopsAndTrips} from '../Core/Helpers.js';

/**
 * Shows a progressbar showing the loading progress of the app.
 */
customElements.define('app-error', class AppError extends BaseElement {

  /**
   * When our custom element is placed inside the DOM.
   */
  connectedCallback() {
    this.watch('error.message', () => this.draw());
    this.draw();
  }

  /**
   * Our lighterHTML render function.
   * @returns {*}
   */
  draw() {
    const s = Store.getState().error;

    return html`
      <p>${s.message}</p>
    `
  }
});