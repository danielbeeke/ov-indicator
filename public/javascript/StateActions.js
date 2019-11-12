import {State} from './core/StateManager.js';
import {getBusStops, getCurrentPosition, getTripsByStop} from './Helpers.js';

/**
 * Gets geolocation, busStops and trips, sends the progress to the state.
 */
export async function getDataForCurrentLocation () {

  /**
   * Gets geolocation and busStops and trips.
   */
  State.transaction('SetLoadingPhase', nextState => nextState.loadingPhase = {
    name: 'geolocation',
    percentage: 20,
    texts: ['Uitzoeken waar je bent...', 'Waar ben jij dan eigenlijk?']
  });
  let coords = null;
  try { coords = await getCurrentPosition() }
  catch (exception) {
    State.transaction('SetLoadingPhase', nextState => nextState.loadingPhase = {
      name: 'gelocationException',
      percentage: 30,
      texts: ['Oeps. Ben je wel verbonden met het internet? Gaf je wel geolocatie toestemming?']
    });
  }
  State.transaction('SetGeolocation', nextState => Object.assign(nextState, coords));

  /**
   * Loads busStops
   */
  State.transaction('SetLoadingPhase', nextState => nextState.loadingPhase = {
    name: 'busStops',
    percentage: 30,
    texts: ['Bezig met het laden van bushaltes...', 'Bushalte informatie ophalen...']
  });
  let state = State.get();
  let busStops = await getBusStops(coords.lat, coords.lng, 5, state.favoriteBusStops);
  State.transaction('SetBusStops', nextState => nextState.busStops = busStops);

  /**
   * Loads trips and shows it in the progressbar.
   */
  State.transaction('SetLoadingPhase', nextState => nextState.loadingPhase = {
    name: 'trips',
    percentage: 40,
    texts: ['Busritten zoeken...', 'Welke bussen zijn er in de buurt?']
  });

  let tripReceivedCounter = 0;
  let percentageOfOneTripOfTotalLoadTime = 40 / busStops.length;
  let tripPromises = busStops.map((busStop) => getTripsByStop(busStop.stop_id).then((busStopTrips) => {
    State.transaction('SetLoadingPhase', nextState => nextState.loadingPhase = {
      name: 'trips',
      percentage: 40 + percentageOfOneTripOfTotalLoadTime * tripReceivedCounter,
      texts: [`Busritten gevonden voor halte ${busStops[tripReceivedCounter].name}`]
    });

    tripReceivedCounter++;
    return {
      stop_id: busStop.stop_id,
      items: busStopTrips
    };
  }));
  let trips = await Promise.all(tripPromises);
  State.transaction('SetTrips', nextState => nextState.trips = trips);

  State.transaction('SetLoadingPhase', nextState => nextState.loadingPhase = {
    name: 'done',
    percentage: 100,
    texts: ['Rijden maar, buschauffeur!']
  });

  State.transaction('SetLoadingPhase', nextState => nextState.loadingPhase.name = 'finished');

  state = State.get();
  State.trigger('setBusStop', state['busStops'][0].stop_id);
}

/**
 * Toggles a busStop or a trip.
 * @param object
 * @param semaphoreKey
 * @param localStorageKey
 * @param value
 * @param button
 */
export function toggleFavorite (object, semaphoreKey, localStorageKey, value, button) {
  object[semaphoreKey] = true;
  let state = State.get();

  if (state[localStorageKey].includes(value)) {
    State.transaction('RemoveFrom' + localStorageKey, (nextState) => {
      nextState[localStorageKey] = nextState[localStorageKey].filter(item => item !== value && item !== null);
    });
  }
  else {
    State.transaction('AddTo' + localStorageKey, (nextState) => {
      nextState[localStorageKey].push(value);
    });
  }

  state = State.get();
  localStorage.setItem(localStorageKey, state[localStorageKey].join(','));

  button.oneAnimationEnd(() => true, () => {
    object[semaphoreKey] = false;
  }, 'show-animation', button.querySelector('svg'));
}

export function setBusStop(busStopId) {
  let state = State.get();
  State.transaction('SetSelectedBusStop', nextState => {
    nextState.selectedBusStop = state.busStops.find(busStop => busStop.stop_id === busStopId);
    nextState.selectedTrips = state.trips.find(trip => trip.stop_id === busStopId).items;
    if (!state.selectedTrip || !state.selectedTrips.includes(state.selectedTrip)) {
      nextState.selectedTrip = nextState.selectedTrips[0];
    }
  });
}

export function setTrip(tripId) {
  State.transaction('SetSelectedTrip', nextState => nextState.selectedTrip = nextState['selectedTrips'].find(trip => trip.trip_id = tripId));
}