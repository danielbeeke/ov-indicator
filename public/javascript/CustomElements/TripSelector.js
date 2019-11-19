import {BaseElement} from '../Core/BaseElement.js';
import {Store} from "../Core/Store.js";
import {html} from "../vendor/lighterhtml.js";
import {currentArrivals} from '../Core/Helpers.js';
import {heartIcon} from '../Icons/HeartIcon.js';

customElements.define('trip-selector', class TripSelector extends BaseElement {

  /**
   * Binds the event so we can use it with lighterHTML, it also calls draw after using the event.
   */
  boundEventMethods() {
    return ['changeStop', 'changeTrip', 'toggleStopFavorite', 'toggleTripFavorite'];
  }

  /**
   * When our custom element is placed inside the DOM.
   */
  connectedCallback() {
    this.draw();
    this.watch('tripSelector.stops', () => this.draw());
    this.watch('tripSelector.trips', () => this.draw());
    this.watch('tripSelector.selectedTrip', () => this.draw());
    this.watch('tripSelector.selectedTrip', () => this.draw());
  }

  /**
   * Changes the stop
   */
  changeStop(value) {
  }

  /**
   * Changes the trip
   */
  changeTrip(value) {
  }

  /**
   * Makes a stop favorite
   */
  toggleStopFavorite(value, button) {
  }

  /**
   * Makes a trip favorite
   */
  toggleTripFavorite(value, button) {

  }

  /**
   * The lighterHTML render method.
   */
  draw() {
    let s = Store.getState().tripSelector;

    return html`
    ${s.selectedStop ? html`
      <div class="stop-selector">
        <select id="selected-stop" onchange="${this.changeStop}" class="${s.stops.length === 0 ? 'hidden' : ''}">
          ${s.stops.map(stop => html`
            <option selected="${s.selectedStop && s.selectedStop.stop_id === stop.stop_id}" value="${stop.stop_id}">
                ${stop.stop_name} (${stop.distance} meter)
            </option>
          `)}
        </select> 
          
        ${s.selectedStop ? html`
          <button 
            class="${s.favoriteStops.includes(s.selectedStop.stop_id) ? 'favorite' : ''} favorite-button" 
            onclick="${this.toggleStopFavorite}">
            ${heartIcon()}
          </button>
        ` : ''}
      </div>
    ` : ''}
    
    ${currentArrivals(s) ? html`
      <div class="trip-selector">
        <select id="selected-trip" onchange="${this.changeTrip}">
        ${currentArrivals(s).map(arrival => html`
          <option selected="${s.selectedTrip && s.selectedTrip.trip_id === arrival.trip_id}" value="${arrival.trip_id}">
            ${arrival.route_short_name} 
            ${arrival.trip_headsign} 
          </option>
        `)}
        </select>
      
        <button 
          class="${s.selectedTrip && s.favoriteTrips.includes(s.selectedTrip.route_short_name) ? 'favorite' : ''} favorite-button" 
          onclick="${this.toggleTripFavorite}">
          ${heartIcon()}
        </button>
      </div>
    ` : ''} 
    `;
  }
});