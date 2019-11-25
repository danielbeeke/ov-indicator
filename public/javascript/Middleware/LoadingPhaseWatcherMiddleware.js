import {changeLoadingPhase, finishLoading} from "../Actions/LoadingScreenActions.js";
import {isPromise} from "../Core/Helpers.js";

/**
 * Watches the actions on the state an if needed updates the app loading progress.
 */
export const loadingPhaseWatcherMiddleware = store => next => action => {
  const state = store.getState();

  if (state.loadingScreen.isLoading) {
    if (isPromise(action.payload)) {
      if (action.type === 'request-geolocation') changeLoadingPhase('geolocation');
      if (action.type === 'fetch-stops') changeLoadingPhase('loadingStops');
      if (action.type === 'fetch-trips') changeLoadingPhase('loadingTrips');
    }

    if (action.type === 'fetch-trips' && action.success) {
      changeLoadingPhase('done');
      setTimeout(finishLoading, 400);
    }
  }

  return next(action)
};