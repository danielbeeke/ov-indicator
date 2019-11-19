import {produce} from "../vendor/immer.js";

export function loadingScreen (state = {
  phase: 'boot',
  progress: 0,
  text: 'App loading',
  error: '',
  isLoading: true,
}, action) {
  return produce(state, nextState => {

    if (action.type === 'change-loading-phase') {
      nextState.phase = action.payload.phase;
      nextState.percentage = action.payload.percentage;
      nextState.text = action.payload.text;
      nextState.error = action.payload.error ? action.payload.error : '';
    }
    else {
      nextState.error = '';
    }

    if (action.type === 'finish-loading') {
      nextState.isLoading = false;
    }

  });
}