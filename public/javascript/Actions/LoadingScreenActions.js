import {Store} from '../Core/Store.js';

export const changeLoadingPhase = (phase, additional = {}) => {
  Store.dispatch({
    type: 'change-loading-phase',
    payload: {
      phase: phase,
      ...additional
    }
  })
};

export const finishLoading = () => {
  Store.dispatch({
    type: 'finish-loading',
  })
};