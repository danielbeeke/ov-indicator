import {getBusStops, getCurrentPosition, relativeTime} from './Helpers.js';
import {render, html} from 'https://unpkg.com/lighterhtml?module';

/**
 * Initial state object.
 */
let state = {
  busStops: [],
  selectedBusStop: null,
  selectedArrival: null,
  favoriteBusStops: localStorage.getItem('favoriteBusStops') ? localStorage.getItem('favoriteBusStops').split(',') : []
};

/**
 * Favorite busStops first then comes the most near ones.
 */
function sortBusStops () {
  state.busStops.sort(function (a, b) {
    let firstSort = state.favoriteBusStops.includes(b.stop_id) - state.favoriteBusStops.includes(a.stop_id);
    if (firstSort !== 0) { return firstSort }
    return a.distance - b.distance;
  });
}

/**
 * Get near busStops and their arrivals.
 * Draw the app with that data inserted in the state.
 */
document.body.dispatchEvent(new CustomEvent('loading', { detail: 'geoLocation' }));

getCurrentPosition()
  .then(position => {
    document.body.dispatchEvent(new CustomEvent('loading', { detail: 'busStops' }));

    return getBusStops(position.coords.latitude, position.coords.longitude, 5)
  })
  .then(busStops => {
    state.busStops = busStops;
    state.selectedBusStop = busStops[0];
    state.selectedArrival = state.selectedBusStop.arrivals[0];
    sortBusStops();
    draw();
    document.body.dispatchEvent(new CustomEvent('loading', { detail: 'done' }));
  });

/**
 * Initial render and refresher
 */
setInterval(draw, 1000);
draw();

/**
 * Functions for the view.
 */

/**
 * Changes the busStop
 */
function changeBusStop () {
  state.selectedBusStop = state.busStops.find(busStop => busStop.stop_id === this.value);
  state.selectedArrival = state.selectedBusStop.arrivals[0];
  draw();
}

/**
 * Changes the arrival
 */
function changeArrival () {
  state.selectedArrival = state.selectedBusStop.arrivals.find(arrival => arrival.trip_id === this.value);
  draw();
}

/**
 * Toggles the favorite flag on a busStop.
 */
function toggleBusStopFavorite () {

  // Remove it.
  if (state.favoriteBusStops.includes(state.selectedBusStop.stop_id)) {
    state.favoriteBusStops = state.favoriteBusStops.filter(busStopId => busStopId !== state.selectedBusStop.stop_id)
  }

  // Add it.
  else {
    state.favoriteBusStops.push(state.selectedBusStop.stop_id);
  }

  // Save.
  localStorage.setItem('favoriteBusStops', state.favoriteBusStops.join(','));

  sortBusStops();

  draw();
}

/**
 * The lighterHTML render method.
 */
function draw() {
  render(document.body.querySelector('#app'), () => html`

    <select id="selectedBusStop" onchange="${changeBusStop}" class="${state.busStops.length === 0 ? 'hidden' : '' }">
      ${state.busStops.map(busStop => html`
        <option selected="${state.selectedBusStop && state.selectedBusStop.stop_id === busStop.stop_id}" value="${busStop.stop_id}">${busStop.name}</option>
      `)}
    </select>
        
    ${state.selectedBusStop ? html`

      <button class="${state.favoriteBusStops.includes(state.selectedBusStop.stop_id) ? 'favorite' : ''}" onclick="${toggleBusStopFavorite}">*</button>

      <select id="selectedArrival" onchange="${changeArrival}">
      ${state.selectedBusStop.arrivals.map(arrival => html`
        <option selected="${state.selectedArrival && state.selectedArrival.trip_id === arrival.trip_id}" value="${arrival.trip_id}">
          ${arrival.route_short_name} 
          ${arrival.trip_headsign} 
        </option>
      `)}
      </select>
    ` : ''}   
      
    ${state.selectedArrival ? html`
      <span class="relative-time">${relativeTime(state.selectedArrival.ts, state.selectedArrival.route_short_name)}</span>
      ${state.selectedArrival.punctuality ? html`
        <span class="punctuality">${relativeTime((new Date() / 1000) + parseInt(state.selectedArrival.punctuality), false)}</span>
      ` : ''}
    ` : ''}
    
  `);
}