import {render} from '../vendor/lighterhtml.js';
import {watch} from '../vendor/ReduxWatch.js';
import {Store} from "./Store.js";

export class BaseElement extends HTMLElement {
  constructor () {
    super();
    let elementDraw = this.draw;
    this.subscribers = [];

    this.draw = function () {
      render(this, () => {
        return elementDraw.apply(this, arguments);
      });
    };

    this.boundEventMethods().forEach(boundEventName => {
      if (this[boundEventName]) {
        this[boundEventName] = this.bindEvent(this[boundEventName]);
      }
    });
  }

  bindEvent = (callback) => {
    let that = this;
    return function () {
      callback.apply(that, [this.value, this]);
      that.draw();
    };
  };

  boundEventMethods () { return [];}

  draw () {}

  watch (objectPath, callback) {

    let wrappedWatch = function(objectPath, callback) {
      return Store.subscribe(watch(Store.getState, objectPath)((newVal, oldVal, objectPath) => {
        callback(newVal.get(objectPath), oldVal.get(objectPath));
      }));
    };

    this.subscribers.push(wrappedWatch(objectPath, callback))
  }

  disconnectedCallback () {
    this.subscribers.forEach(unsubscribe => unsubscribe());
  }
}