import {produce} from "../vendor/immer.js";

/**
 * Holds information about the loading screen, is a Redux reducer
 */
export function loadingScreenReducer (state = {
  phase: 'boot',
  progress: 0,
  text: 'App loading',
  isLoading: true,
}, action) {
  return produce(state, nextState => {

    if (action.type === 'change-loading-phase') {
      nextState.phase = action.payload.phase;
      nextState.percentage = action.payload.percentage;
      nextState.text = action.payload.text;
    }

    if (action.type === 'finish-loading') {
      nextState.isLoading = false;
    }

  });
}