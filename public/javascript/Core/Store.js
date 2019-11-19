import {createStore, combineReducers, applyMiddleware, compose} from '../vendor/Redux.js';
import {loadingScreenReducer} from '../StoreReducers/LoadingScreenReducer.js';
import {deviceReducer} from '../StoreReducers/DeviceReducer.js';
import {tripSelectorReducer} from '../StoreReducers/TripSelectorReducer.js';
import {loadingPhaseEnhancerMiddleware} from '../Middleware/LoadingPhaseEnhancerMiddleware.js';
import {promiseMiddleware} from '../Middleware/PromiseMiddleware.js';
import {loadingPhaseWatcherMiddleware} from '../Middleware/LoadingPhaseWatcherMiddleware.js';
import persistState from '../vendor/redux-localstorage/persistState.js';
import {savableSlicer} from './SavableSlicer.js';

const initialState = {};

const reducers = combineReducers({
  loadingScreen: loadingScreenReducer,
  tripSelector: tripSelectorReducer,
  device: deviceReducer
});

const middleware = applyMiddleware(
  loadingPhaseWatcherMiddleware,
  promiseMiddleware,
  loadingPhaseEnhancerMiddleware,
);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const Store = createStore(reducers, initialState, composeEnhancers(middleware, persistState(null, {
  slicer: savableSlicer
})));