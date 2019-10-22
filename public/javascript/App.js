import {getBusStops, proxy, getCurrentPosition, relativeTime} from './Helpers.js';
import {render, html} from 'https://unpkg.com/lighterhtml?module';

/**
 * Initial state object.
 */
let state = {
  busStops: [],
  selectedBusStop: null,
  selectedArrival: null,
};

/**
 * Get near busStops and their arrivals.
 * Draw the app with that data inserted in the state.
 */
getCurrentPosition()
.then(position => getBusStops(position.coords.latitude, position.coords.longitude, 5)
.then(busStops => {
  state.busStops = busStops;
  state.selectedBusStop = busStops[0];
  state.selectedArrival = state.selectedBusStop.arrivals[0];
  draw();
}));

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
 * The lighterHTML render method.
 */
function draw() {
  render(document.body.querySelector('#app'), () => html`

    <select id="selectedBusStop" onchange="${changeBusStop}" class="${state.busStops.length === 0 ? 'hidden' : '' }">
      ${state.busStops.map(busStop => html`
        <option value="${busStop.stop_id}">${busStop.name}</option>
      `)}
    </select>
    
    ${state.selectedBusStop ? html`
      <select id="selectedArrival" onchange="${changeArrival}">
      ${state.selectedBusStop.arrivals.map(arrival => html`
        <option value="${arrival.trip_id}">
          ${arrival.route_short_name} 
          ${arrival.trip_headsign} 
        </option>
      `)}
      </select>
    ` : ''}   
      
    ${state.selectedArrival ? html`
      <span class="relative-time">${relativeTime(state.selectedArrival.ts, state.selectedArrival.route_short_name)}</span>
      ${state.selectedArrival.punctuality ? html`
        <span class="punctuality">${Math.abs(state.selectedArrival.punctuality)} seconden ${state.selectedArrival.punctuality > 0 ? 'later' : 'te vroeg'}</span>
      ` : ''}
    ` : ''}
    
  `);
}