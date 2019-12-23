import {BaseElement} from '../Core/BaseElement.js';
import {Store} from "../Core/Store.js";
import {html} from "../vendor/lighterhtml.js";
import {currentArrivals, groupedStops, tripKey} from '../Helpers/Various.js';
import {heartIcon} from '../Icons/HeartIcon.js';
import {setStop, setTrip, toggleStopFavorite, toggleTripFavorite} from "../Actions/TripSelectorActions.js";
import {relativeTime} from '../Helpers/RelativeTime.js';
import {calculateDistance} from '../Helpers/CalculateDistance.js';

/**
 * Defines two selects, a stop and a trip select.
 * Also defines two buttons to make a stop or a trip favorite.
 */
customElements.define('trip-selector', class TripSelector extends BaseElement {

  connectedCallback() {
    this.draw();
    this.watch([
      'tripSelector.selectedStop',
      'tripSelector.selectedTrip'
    ], () => {this.draw()});
    this.interval = setInterval(() => {
      this.draw();
    }, 1000);
  }

  /**
   * The lighterHTML render method.
   */
  draw() {
    const s = Store.getState().tripSelector;
    const d = Store.getState().device;

    return html`
    ${s.selectedStop ? html`
      <div class="stop-selector">
        <label class="label">Bus/trein station</label>
        <select id="selected-stop" onchange="${e => setStop(e.target.value)}" class="${s.stops.length === 0 ? 'hidden' : ''}">
          ${groupedStops(s).map(stop => html`
            <option selected="${s.selectedStop && s.selectedStop.stop_id === stop.stop_id}" value="${stop.stop_id}">
                ${stop.stop_name} (${calculateDistance(stop.stop_lat, stop.stop_lon, d.lat, d.lng)} m.)
            </option>
          `)}
        </select> 
          
        ${s.selectedStop ? html`
          <button 
            class="${s.favoriteStops.includes(s.selectedStop.stop_id) ? 'favorite' : ''} favorite-button ${s.favoriteStopToggleShouldAnimate ? 'show-animation' : ''}"
            onclick="${e => toggleStopFavorite(e.target)}">
            ${heartIcon()}
          </button>
        ` : ''}
      </div>
    ` : ''}
    
    ${currentArrivals(s) ? html`
      <div class="trip-selector">
        <label class="label">Reis</label>
        <select id="selected-trip" onchange="${e => setTrip(e.target.value)}">
        ${currentArrivals(s).map(arrival => html`
          <option selected="${s.selectedTrip && s.selectedTrip.trip_id === arrival.trip_id}" value="${arrival.trip_id}">
            ${arrival.route_short_name} 
            ${arrival.trip_headsign} 
            (${relativeTime(arrival.ts, false, 'short')})
          </option>
        `)}
        </select>
      
        <button 
          class="${s.selectedTrip && s.favoriteTrips.includes(tripKey(s.selectedTrip)) ? 'favorite' : ''} favorite-button ${s.favoriteTripToggleShouldAnimate ? 'show-animation' : ''}" 
          onclick="${e => toggleTripFavorite(e.target)}">
          ${heartIcon()}
        </button>
      </div>
    ` : html`
      <div class="trip-selector">
        <label class="label">Reis</label>
        <span class="no-trips">Er zijn geen reizen gevonden voor de geselecteerde halte.</span>
      </div>
    `} 
    `;
  }
});