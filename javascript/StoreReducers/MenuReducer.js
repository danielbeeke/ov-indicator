import {produce} from "../vendor/immer.js";

/**
 * Catches error information, is a Redux reducer
 */
export function menuReducer (state = {
  expanded: false
}, action) {
  return produce(state, nextState => {
    if (action.type === 'toggle-menu') {
      nextState.expanded = !nextState.expanded;
    }
  });
}