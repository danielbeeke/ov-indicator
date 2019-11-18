import {produce} from "../vendor/immer.js";

export function loadingScreen (state = {
  phase: 'boot',
  progress: 0,
  text: 'App loading'
}, action) {
  return produce(state, nextState => {
    if (action.type === 'change-loading-phase') {
      nextState.phase = action.phase;
    }
  });
}