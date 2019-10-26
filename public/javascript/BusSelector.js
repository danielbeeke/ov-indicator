import {getBusStops, getCurrentPosition, relativeTime, calculateDistance} from './Helpers.js';
import {BaseElement} from './BaseElement.js';
import {html} from 'https://unpkg.com/lighterhtml?module';
import './BusIndicator.js';

customElements.define('bus-selector', class BusSelector extends BaseElement {
  constructor() {
    super();
    Object.assign(this, {
      busStops: [],
      lat: null,
      lng: null,
      animateToggleButtonBusStop: false,
      animateToggleButtonTrip: false,
      currentGeolocationWatcher: null,
      selectedBusStop: null,
      selectedTrip: null,
      favoriteBusStops: localStorage.getItem('favoriteBusStops') ? localStorage.getItem('favoriteBusStops').split(',') : [],
      favoriteTrips: localStorage.getItem('favoriteTrips') ? localStorage.getItem('favoriteTrips').split(',') : []
    });

    document.body.addEventListener('loading', event => {
      if (event.detail === 'destroyed') {
        this.classList.remove('hidden')
      }
    });
  }

  /**
   * Binds the event so we can use it with lighterHTML, it also calls draw after using the event.
   */
  boundEventMethods () {
    return ['changeBusStop', 'changeTrip', 'toggleBusStopFavorite', 'toggleTripFavorite'];
  }

  /**
   * Favorite busStops first then comes the most near ones.
   */
  sortBusStops () {
    this.busStops.forEach(busStop => {
      busStop.distance = calculateDistance(busStop.stop_lat, busStop.stop_lon, this.lat, this.lng);
    });

    this.busStops.sort((a, b) => {
      let firstSort = this.favoriteBusStops.includes(b.stop_id) - this.favoriteBusStops.includes(a.stop_id);
      if (firstSort !== 0) { return firstSort }
      return a.distance - b.distance;
    });
  }

  connectedCallback () {
    /**
     * Get near busStops and their trips.
     * Draw the app with that data inserted in the state.
     */
    document.body.dispatchEvent(new CustomEvent('loading', { detail: 'geoLocation' }));

    getCurrentPosition()
      .then(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

        document.body.dispatchEvent(new CustomEvent('loading', { detail: 'busStops' }));
        return getBusStops(position.coords.latitude, position.coords.longitude, 5)
      })
      .then(busStops => {
        this.busStops = busStops;
        this.sortBusStops();
        this.selectedBusStop = this.busStops[0];

        if (this.selectedBusStop && this.selectedBusStop.trips) {
          this.selectedTrip = this.selectedBusStop.trips[0];
          this.emitSelectionAndData();
        }
        this.draw();
        document.body.dispatchEvent(new CustomEvent('loading', { detail: 'done' }));
      });

    /**
     * Initial render and refresher
     */
    setInterval(() => this.draw(), 1000);
    this.draw();
  }
  
  emitSelectionAndData () {
    document.body.dispatchEvent(new CustomEvent('selectedData', {
      detail: {
        busStop: this.selectedBusStop,
        trip: this.selectedTrip,
        lat: this.lat,
        lng: this.lng
      }
    }));
  }


  /**
   * Changes the busStop
   */
  changeBusStop (value) {
    this.selectedBusStop = this.busStops.find(busStop => busStop.stop_id === value);
    this.selectedTrip = this.selectedBusStop.trips[0];

    if (this.currentGeolocationWatcher) {
      navigator.geolocation.clearWatch(this.currentGeolocationWatcher);
    }

    this.emitSelectionAndData();

    this.currentGeolocationWatcher = navigator.geolocation.watchPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.emitSelectionAndData();
      this.draw();

      if (this.selectedBusStop.distance < 10) {
        navigator.geolocation.clearWatch(this.currentGeolocationWatcher);
      }
    }, error => {}, {
      enableHighAccuracy: true,
      maximumAge: 10
    });
  }

  /**
   * Changes the trip
   */
  changeTrip (value) {
    this.selectedTrip = this.selectedBusStop.trips.find(trip => trip.trip_id === value);
    this.emitSelectionAndData();
  }

  /**
   * Makes a busStop favorite
   */
  toggleBusStopFavorite (value, button) {
    button.addEventListener('animationend', () => {
      this.animateToggleButtonBusStop = false;
    }, { once: true });
    this.animateToggleButtonBusStop = true;

    // Remove it.
    if (this.favoriteBusStops.includes(this.selectedBusStop.stop_id)) {
      this.favoriteBusStops = this.favoriteBusStops.filter(busStopId => busStopId !== this.selectedBusStop.stop_id)
    }

    // Add it.
    else {
      this.favoriteBusStops.push(this.selectedBusStop.stop_id);
    }

    // Save.
    localStorage.setItem('favoriteBusStops', this.favoriteBusStops.join(','));

    this.sortBusStops();
  }

  /**
   * Makes a trip favorite
   */
  toggleTripFavorite (value, button) {
    button.addEventListener('animationend', () => {
      this.animateToggleButtonTrip = false;
    }, { once: true });
    this.animateToggleButtonTrip = true;

    // Remove it.
    if (this.favoriteTrips.includes(this.selectedTrip.route_short_name)) {
      this.favoriteTrips = this.favoriteBusStops.filter(tripId => tripId !== this.selectedTrip.route_short_name)
    }

    // Add it.
    else {
      this.favoriteTrips.push(this.selectedTrip.route_short_name);
    }

    // Save.
    localStorage.setItem('favoriteTrips', this.favoriteTrips.join(','));
  }

  /**
   * The lighterHTML render method.
   */
  draw() {
    return html`

    <div class="bus-selector">
      <select id="selectedBusStop" onchange="${this.changeBusStop}" class="${this.busStops.length === 0 ? 'hidden' : '' }">
        ${this.busStops.map(busStop => html`
          <option selected="${this.selectedBusStop && this.selectedBusStop.stop_id === busStop.stop_id}" value="${busStop.stop_id}">
              ${busStop.name} (${busStop.distance} meter)
          </option>
        `)}
      </select>
        
      ${this.selectedBusStop ? html`
        <button class="
          ${this.favoriteBusStops.includes(this.selectedBusStop.stop_id) ? 'favorite' : ''} 
          ${ this.animateToggleButtonBusStop ? 'show-animation' : '' } favorite-button" onclick="${this.toggleBusStopFavorite}">
          <span class="inner">♥</span>
        </button>
      ` : ''}
    </div>
    
    ${this.selectedBusStop ? html`
      <div class="trip-selector">

        <select id="selectedTrip" onchange="${this.changeTrip}">
        ${this.selectedBusStop.trips.map(trip => html`
          <option selected="${this.selectedTrip && this.selectedTrip.trip_id === trip.trip_id}" value="${trip.trip_id}">
            ${trip.route_short_name} 
            ${trip.trip_headsign} 
            (${relativeTime(trip.ts, false, 'short')})
          </option>
        `)}
        </select>
      
        <button class="
          ${this.favoriteTrips.includes(this.selectedTrip.route_short_name) ? 'favorite' : ''} 
          ${ this.animateToggleButtonTrip ? 'show-animation' : '' } favorite-button" 
          onclick="${this.toggleTripFavorite}">
          <span class="inner">♥</span>
        </button>
      </div>
    ` : ''} 
    `;
  }

});