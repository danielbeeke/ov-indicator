import { createStore, combineReducers, applyMiddleware } from '../vendor/Redux.js';
import { loadingScreen } from '../StoreReducers/LoadingScreenReducer.js';
import { stopAndTripSelector } from '../StoreReducers/StopAndTripSelectorReducer.js';
import { loadingPhaseEnhancer } from '../Middleware/PhaseInformation.js';

let initialState = {};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let reducers = combineReducers({
  loadingScreen,
  stopAndTripSelector
});

let middlewares = applyMiddleware(
  loadingPhaseEnhancer,
);

export const Store = createStore(reducers, initialState, composeEnhancers(middlewares));