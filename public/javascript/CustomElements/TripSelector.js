import {BaseElement} from '../Core/BaseElement.js';
import {Store} from "../Core/Store.js";
import {html} from "../vendor/lighterhtml.js";
import {currentArrivals, tripKey} from '../Core/Helpers.js';
import {heartIcon} from '../Icons/HeartIcon.js';
import {setStop, setTrip, toggleStopFavorite, toggleTripFavorite} from "../Actions/TripSelectorActions.js";

/**
 * Defines two selects, a stop and a trip select.
 * Also defines two buttons to make a stop or a trip favorite.
 */
customElements.define('trip-selector', class TripSelector extends BaseElement {

  connectedCallback() {
    this.draw();
    this.watch([
      'tripSelector.stops',
      'tripSelector.trips',
      'tripSelector.selectedStop',
      'tripSelector.selectedTrip'
    ], () => this.draw());
  }

  /**
   * The lighterHTML render method.
   */
  draw() {
    const s = Store.getState().tripSelector;

    return html`
    ${s.selectedStop ? html`
      <div class="stop-selector">
        <select id="selected-stop" onchange="${e => setStop(e.target.value)}" class="${s.stops.length === 0 ? 'hidden' : ''}">
          ${s.stops.map(stop => html`
            <option selected="${s.selectedStop && s.selectedStop.stop_id === stop.stop_id}" value="${stop.stop_id}">
                ${stop.stop_name} (${stop.distance} meter)
            </option>
          `)}
        </select> 
          
        ${s.selectedStop ? html`
          <button 
            class="${s.favoriteStops.includes(s.selectedStop.stop_id) ? 'favorite' : ''} favorite-button" 
            onclick="${toggleStopFavorite}">
            ${heartIcon()}
          </button>
        ` : ''}
      </div>
    ` : ''}
    
    ${currentArrivals(s) ? html`
      <div class="trip-selector">
        <select id="selected-trip" onchange="${e => setTrip(e.target.value)}">
        ${currentArrivals(s).map(arrival => html`
          <option selected="${s.selectedTrip && s.selectedTrip.trip_id === arrival.trip_id}" value="${arrival.trip_id}">
            ${arrival.route_short_name} 
            ${arrival.trip_headsign} 
          </option>
        `)}
        </select>
      
        <button 
          class="${s.selectedTrip && s.favoriteTrips.includes(tripKey(s.selectedTrip)) ? 'favorite' : ''} favorite-button" 
          onclick="${toggleTripFavorite}">
          ${heartIcon()}
        </button>
      </div>
    ` : ''} 
    `;
  }
});