import {getBusStops, getCurrentPosition, relativeTime, calculateDistance} from './Helpers.js';
import {BaseElement} from './BaseElement.js';
import {render, html} from 'https://unpkg.com/lighterhtml?module';

customElements.define('bus-selector', class BusSelector extends BaseElement {
  constructor() {
    super();
    Object.assign(this, {
      busStops: [],
      lat: null,
      lng: null,
      currentGeolocationWatcher: null,
      selectedBusStop: null,
      selectedArrival: null,
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
    return ['changeBusStop', 'changeArrival', 'toggleBusStopFavorite', 'toggleTripFavorite'];
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
     * Get near busStops and their arrivals.
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

        if (this.selectedBusStop && this.selectedBusStop.arrivals) {
          this.selectedArrival = this.selectedBusStop.arrivals[0];
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


  /**
   * Changes the busStop
   */
  changeBusStop (value) {
    this.selectedBusStop = this.busStops.find(busStop => busStop.stop_id === value);
    this.selectedArrival = this.selectedBusStop.arrivals[0];

    if (this.currentGeolocationWatcher) {
      navigator.geolocation.clearWatch(this.currentGeolocationWatcher);
    }

    this.currentGeolocationWatcher = navigator.geolocation.watchPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.draw();

      if (this.selectedBusStop.distance < 10) {
        navigator.geolocation.clearWatch(this.currentGeolocationWatcher);
      }
    }, (error) => {
      console.warn(error);
    }, {
      enableHighAccuracy: true,
      maximumAge: 10
    });
  }

  /**
   * Changes the arrival
   */
  changeArrival (value) {
    this.selectedArrival = this.selectedBusStop.arrivals.find(arrival => arrival.trip_id === value);
  }

  /**
   * Makes a busStop favorite
   */
  toggleBusStopFavorite () {

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
  toggleTripFavorite () {
    // Remove it.
    if (this.favoriteTrips.includes(this.selectedArrival.route_short_name)) {
      this.favoriteTrips = this.favoriteBusStops.filter(tripId => tripId !== this.selectedArrival.route_short_name)
    }

    // Add it.
    else {
      this.favoriteTrips.push(this.selectedArrival.route_short_name);
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

      <button class="${this.favoriteBusStops.includes(this.selectedBusStop.stop_id) ? 'favorite' : ''} favorite-button" onclick="${this.toggleBusStopFavorite}"><span class="inner">♥</span>
      </button>

    ` : ''}
    </div>
    
    ${this.selectedBusStop ? html`

      <div class="trip-selector">

      <select id="selectedArrival" onchange="${this.changeArrival}">
      ${this.selectedBusStop.arrivals.map(arrival => html`
        <option selected="${this.selectedArrival && this.selectedArrival.trip_id === arrival.trip_id}" value="${arrival.trip_id}">
          ${arrival.route_short_name} 
          ${arrival.trip_headsign} 
          (${relativeTime(arrival.ts, false, 'short')})
        </option>
      `)}
      </select>
      
    <button class="${this.favoriteTrips.includes(this.selectedArrival.route_short_name) ? 'favorite' : ''} favorite-button" onclick="${this.toggleTripFavorite}"><span class="inner">♥</span>
    </button>

    </div>
    ` : ''}   
    
  `;
  }

});