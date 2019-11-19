import {BaseElement} from '../Core/BaseElement.js';
import {html} from '../vendor/lighterhtml.js';
import {Store} from '../Core/Store.js';
import {getGeolocation, getStops, getTrips} from "../Actions/StopSelector.js";

customElements.define('app-loader', class AppLoader extends BaseElement {

  /**
   * When our custom element is placed inside the DOM.
   */
  connectedCallback() {
    this.watch('loadingScreen.phase', () => this.draw());
    getGeolocation().then(() => {
      let {lat, lng} = Store.getState().device;
      getStops(lat, lng, 5).then(stops => {
        getTrips(stops.map(stop => stop.stop_id));
      });
    });
  }

  /**
   * Our lighterHTML render function.
   * @returns {*}
   */
  draw() {
    let s = Store.getState().loadingScreen;

    return html`
      <div class="progress-bar-wrapper${s.phase === ' done' ? 'done' : ''}">
        <div class="progress-bar" style="width: ${s.percentage}%"></div>
        <div class="label">${s.text}</div>
      </div>
    `
  }
});