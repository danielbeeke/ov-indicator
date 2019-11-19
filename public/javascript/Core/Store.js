import {createStore, combineReducers, applyMiddleware} from '../vendor/Redux.js';
import {loadingScreen} from '../StoreReducers/LoadingScreenReducer.js';
import {device} from '../StoreReducers/DeviceReducer.js';
import {tripSelector} from '../StoreReducers/TripSelectorReducer.js';
import {loadingPhaseEnhancer} from '../Middleware/LoadingPhaseEnhancer.js';
import {promise} from '../Middleware/Promise.js';
import {loadingPhaseWatcher} from '../Middleware/LoadingPhaseWatcher.js';

let initialState = {};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let reducers = combineReducers({
  loadingScreen,
  tripSelector,
  device
});

let middleware = applyMiddleware(
  loadingPhaseWatcher,
  promise,
  loadingPhaseEnhancer,
);

export const Store = createStore(reducers, initialState, composeEnhancers(middleware));