import {Store} from '../Core/Store.js';

export const changeLoadingPhase = (phase) => {
  Store.dispatch({
    type: 'change-loading-phase',
    phase: phase
  })
};