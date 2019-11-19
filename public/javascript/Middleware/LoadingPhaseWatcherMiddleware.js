import {changeLoadingPhase, finishLoading} from "../Actions/LoadingScreenActions.js";
import {isPromise} from "../Core/Helpers.js";

/**
 * Watches the actions on the state an if needed updates the app loading progress.
 */
export const loadingPhaseWatcherMiddleware = store => next => action => {
  const state = store.getState();

  if (state.loadingScreen.isLoading) {
    if (isPromise(action.payload)) {
      if (action.type === 'get-geolocation') changeLoadingPhase('geolocation');
      if (action.type === 'get-stops') changeLoadingPhase('loadingStops');
      if (action.type === 'get-trips') changeLoadingPhase('loadingTrips');
    }

    if (action.type === 'get-trips' && action.success) {
      changeLoadingPhase('done');
      setTimeout(finishLoading, 400);
    }

    if (action.error) {
      changeLoadingPhase(action.type === 'get-geolocation' ? 'geoError' : 'error', {
        error: action.error
      });
    }
  }

  return next(action)
};