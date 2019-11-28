import {createStore, applyMiddleware, compose} from '../vendor/Redux.js';
import {loadingScreenReducer} from '../StoreReducers/LoadingScreenReducer.js';
import {deviceReducer} from '../StoreReducers/DeviceReducer.js';
import {tripSelectorReducer} from '../StoreReducers/TripSelectorReducer.js';
import {errorReducer} from '../StoreReducers/ErrorReducer.js';
import {indicatorReducer} from '../StoreReducers/IndicatorReducer.js';
import {loadingPhaseEnhancerMiddleware} from '../Middleware/LoadingPhaseEnhancerMiddleware.js';
import {promiseMiddleware} from '../Middleware/PromiseMiddleware.js';
import {loadingPhaseWatcherMiddleware} from '../Middleware/LoadingPhaseWatcherMiddleware.js';
import persistState from '../vendor/redux-localstorage/persistState.js';
import {sharedCombineReducers} from '../Helpers/Various.js';
import {savableSlicer} from './SavableSlicer.js';

const initialState = {};

const reducers = sharedCombineReducers({
  indicator: indicatorReducer,
  loadingScreen: loadingScreenReducer,
  tripSelector: tripSelectorReducer,
  device: deviceReducer,
  error: errorReducer,
});

const middleware = applyMiddleware(
  loadingPhaseWatcherMiddleware,
  loadingPhaseEnhancerMiddleware,
  promiseMiddleware,
);

const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

let enhancers = typeof navigator !== 'undefined' ?
composeEnhancers(middleware, persistState(null, {
  // slicer: savableSlicer
})) : middleware;

export const Store = createStore(reducers, initialState, enhancers);