import {Store} from '../Core/Store.js';

export const setAverageWalkingSpeed = (averageWalkingSpeed) => {
  Store.dispatch({
    type: 'set-average-walking-speed',
    payload: {
      averageWalkingSpeed: averageWalkingSpeed
    }
  })
};

export const setPrepareMinutes = (prepareMinutes) => {
  Store.dispatch({
    type: 'set-prepare-minutes',
    payload: {
      prepareMinutes: prepareMinutes
    }
  })
};