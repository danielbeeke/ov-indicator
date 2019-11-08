import {getBusStops, getCurrentPosition} from './Helpers.js';
import {BaseElement} from './BaseElement.js';
import {html} from './vendor/lighterhtml.js';
import {Store} from "./Store.js";
import './OneTransitionEnd.js';

customElements.define('bus-selector', class BusSelector extends BaseElement {
  constructor() {
    super();

    /**
     * When the preloader is destroyed we will fade in.
     */
    Store.watch('loadingPhase', (newPhase) => {
      if (newPhase === 'destroyed') this.classList.remove('hidden');
    });

    Store.watch('selectedBusStop', () => {
      if (Store.getState().selectedBusStop.distance < 10) {
        Store.trigger('clearCurrentGeolocationWatcher');
      }
    });
  }

  /**
   * Binds the event so we can use it with lighterHTML, it also calls draw after using the event.
   */
  boundEventMethods () {
    return ['changeBusStop', 'changeTrip', 'toggleBusStopFavorite', 'toggleTripFavorite'];
  }

  connectedCallback () {
    /**
     * Get near busStops and their trips.
     * Draw the app with that data inserted in the state.
     */
    Store.trigger('loadingPhase', 'geoLocation');

    getCurrentPosition()
    .then(position => {
      Store.trigger('updateGeolocation', {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });

      Store.trigger('loadingPhase', 'busStops');
      return getBusStops(Store.getState().lat, Store.getState().lng)
    })
    .then(busStops => {
      this.setNewBusStops(busStops);

      this.draw();
      Store.trigger('loadingPhase', 'done');
    })
    .catch(error => {
      Store.trigger('loadingPhase', 'noGeolocation');
    });

    /**
     * Initial render and refresher
     */
    setInterval(() => this.draw(), 1000);
    this.draw();
  }

  /**
   * When new data arrives we set it to the store and trigger some other actions like sort and calculate distances.
   * @param busStops
   */
  setNewBusStops (busStops) {
    Store.trigger('setBusStops', busStops);
    Store.trigger('updateDistancesBusStops');
    Store.trigger('sortBusStops');

    if (Store.getState().busStops[0]) {
      Store.trigger('setSelectedBusStop', Store.getState().busStops[0]);

      if (Store.getState().selectedBusStop.trips) {
        Store.trigger('setSelectedTrip', Store.getState().selectedBusStop.trips[0]);
      }
    }
  }

  /**
   * Changes the busStop
   */
  changeBusStop (value) {
    Store.trigger('changeBusStop', value)
  }

  /**
   * Changes the trip
   */
  changeTrip (value) {
    Store.trigger('changeTrip', value)
  }

  /**
   * Makes a busStop favorite
   */
  toggleBusStopFavorite (value, button) {
    button.oneAnimationEnd(() => true, () => true, 'show-animation', button.querySelector('svg'));
    Store.trigger('toggleItemFromFavoriteBusStops');
    Store.trigger('sortBusStops');
  }

  /**
   * Makes a trip favorite
   */
  toggleTripFavorite (value, button) {
    button.oneAnimationEnd(() => true, () => true, 'show-animation', button.querySelector('svg'));
    Store.trigger('toggleItemFromFavoriteTrips');
  }

  /**
   * The lighterHTML render method.
   */
  draw() {
    let state = Store.getState();

    return html`

    <div class="bus-selector">
      <select id="selectedBusStop" onchange="${this.changeBusStop}" class="${state.busStops.length === 0 ? 'hidden' : '' }">
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
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 50 50" xml:space="preserve"><path d="M24.9 10.1c2-4.8 6.6-8.1 12-8.1 7.2 0 12.4 6.2 13.1 13.5 0 0 0.4 1.8-0.4 5.1 -1.1 4.5-3.5 8.5-6.9 11.5L24.9 48 7.4 32.2c-3.4-3-5.8-7-6.9-11.5 -0.8-3.3-0.4-5.1-0.4-5.1C0.7 8.2 5.9 2 13.2 2 18.5 2 22.8 5.3 24.9 10.1z" fill="#C03A2B"/><path d="M6 18.1c-0.6 0-1-0.4-1-1 0-5.5 4.5-10 10-10 0.6 0 1 0.4 1 1s-0.4 1-1 1c-4.4 0-8 3.6-8 8C7 17.6 6.6 18.1 6 18.1z" fill="#ED7161"/></svg>
        </button>
      ` : ''}
    </div>
    
    ${state.selectedBusStop ? html`
      <div class="trip-selector">

        <select id="selectedTrip" onchange="${this.changeTrip}">
        ${state.selectedBusStop.trips.map(trip => html`
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
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 50 50" xml:space="preserve"><path d="M24.9 10.1c2-4.8 6.6-8.1 12-8.1 7.2 0 12.4 6.2 13.1 13.5 0 0 0.4 1.8-0.4 5.1 -1.1 4.5-3.5 8.5-6.9 11.5L24.9 48 7.4 32.2c-3.4-3-5.8-7-6.9-11.5 -0.8-3.3-0.4-5.1-0.4-5.1C0.7 8.2 5.9 2 13.2 2 18.5 2 22.8 5.3 24.9 10.1z" fill="#C03A2B"/><path d="M6 18.1c-0.6 0-1-0.4-1-1 0-5.5 4.5-10 10-10 0.6 0 1 0.4 1 1s-0.4 1-1 1c-4.4 0-8 3.6-8 8C7 17.6 6.6 18.1 6 18.1z" fill="#ED7161"/></svg>
        </button>
      </div>
    ` : ''} 
    `;
  }

});