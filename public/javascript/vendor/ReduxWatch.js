'use strict';

import { getValue } from '../Core/ObjectPath.js';
import {Store} from "../Core/Store.js";

function defaultCompare (a, b) {
  return a === b
}

export function watch (getState, objectPath, compare) {
  compare = compare || defaultCompare;
  let currentValue = getValue(getState(), objectPath);
  return function w (fn) {
    return function () {
      let newValue = getValue(getState(), objectPath);
      if (!compare(currentValue, newValue)) {
        let oldValue = currentValue;
        currentValue = newValue;
        fn(newValue, oldValue, objectPath)
      }
    }
  }
}

export function wrappedWatch (objectPath, callback) {
  return Store.subscribe(watch(Store.getState, objectPath)((newVal, oldVal, objectPath) => {
    callback(newVal.get(objectPath), oldVal.get(objectPath));
  }));
}