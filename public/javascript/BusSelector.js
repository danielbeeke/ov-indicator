import {BaseElement} from './core/BaseElement.js';
import {html} from './vendor/lighterhtml.js';
import {State} from "./core/StateManager.js";
import './core/OneTransitionEnd.js';
import {heartIconAnimation} from './Icons.js';
import {debounce, sortBusStopsByFavoritesAndDistance} from './Helpers.js';

customElements.define('bus-selector', class BusSelector extends BaseElement {

  /**
   * Binds the event so we can use it with lighterHTML, it also calls draw after using the event.
   */
  boundEventMethods () {
    return [
      'changeBusStop',
      'changeTrip',
      'toggleBusStopFavorite',
      'toggleTripFavorite'
    ];
  }

  connectedCallback () {
    this.isTogglingBusStopFavorite = false;
    this.isTogglingTripFavorite = false;

    State.trigger('getDataForCurrentLocation');
    State.watch([
      'busStops',
      'trips',
      'selectedBusStop',
      'selectedTrips',
      'selectedTrip'
    ], () => {
      this.draw();
    });
  }

  /**
   * Changes the busStop
   */
  changeBusStop (value) {
    State.trigger('setBusStop', value);
  }

  /**
   * Changes the trip
   */
  changeTrip (value) {
    State.trigger('setTrip', value);
  }

  /**
   * Makes a busStop favorite
   */
  toggleBusStopFavorite (value, button) {
    let state = State.get();
    State.trigger('toggleFavorite', [
      this,
      'isTogglingBusStopFavorite',
      'favoriteBusStops',
      state.selectedBusStop.stop_id,
      button
    ]);

    state = State.get();
    State.transaction('SortBusStopsAfterTogglingFavorite', nextState => {
      nextState.busStops = sortBusStopsByFavoritesAndDistance(state.busStops, state.favoriteBusStops);
    });
  }

  /**
   * Makes a trip favorite
   */
  toggleTripFavorite (value, button) {
    let state = State.get();
    State.trigger('toggleFavorite', [
      this,
      'isTogglingTripFavorite',
      'favoriteTrips',
      state.selectedTrip.route_short_name,
      button
    ]);
  }

  /**
   * The lighterHTML render method.
   */
  draw() {
    let state = State.get();

    return html`
      <div class="bus-select">
        <select onchange="${this.changeBusStop}" class="${state.busStops.length === 0 ? 'hidden' : '' }">
          ${state.busStops.map(busStop => html`
            <option selected="${state.selectedBusStop && state.selectedBusStop.stop_id === busStop.stop_id}" value="${busStop.stop_id}">
                ${busStop.name} (${busStop.distance} meter)
            </option>
          `)}
        </select> 
          
        ${state.selectedBusStop ? html`
          <button class="
            ${state.favoriteBusStops.includes(state.selectedBusStop.stop_id) ? 'favorite' : ''} 
             favorite-button" onclick="${this.toggleBusStopFavorite}">
             ${heartIconAnimation(this.isTogglingBusStopFavorite)}
          </button>
        ` : ''}
      </div>
    
      ${state.selectedBusStop && state.selectedTrips ? html`
        <div class="trip-select">
          <select onchange="${this.changeTrip}">
          ${state.selectedTrips.map(trip => html`
            <option selected="${state.selectedTrip && state.selectedTrip.trip_id === trip.trip_id}" value="${trip.trip_id}">
              ${trip.route_short_name} 
              ${trip.trip_headsign} 
            </option>
          `)}
          </select>
        
          <button class="
            ${ state.selectedTrip && state.favoriteTrips.includes(state.selectedTrip.route_short_name) ? 'favorite' : ''} 
             favorite-button" 
            onclick="${this.toggleTripFavorite}">
             ${heartIconAnimation(this.isTogglingTripFavorite)}
          </button>
        </div>
      ` : ''} 
    `;
  }

});