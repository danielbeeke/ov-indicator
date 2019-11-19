import {render} from '../vendor/lighterhtml.js';
import {watch} from '../vendor/ReduxWatch.js';
import {Store} from "./Store.js";

/**
 * Some helpers to easily create Custom Elements composed in a base class.
 */
export class BaseElement extends HTMLElement {
  constructor () {
    super();
    this.subscribers = [];

    // Binds draw to the element.
    const elementDraw = this.draw;
    this.draw = function () {
      render(this, () => elementDraw.apply(this, arguments));
    };

    // Binds all the methods of the view to the element.
    this.boundEventMethods().forEach(boundEventName => {
      if (this[boundEventName]) {
        this[boundEventName] = this.bindEvent(this[boundEventName]);
      }
    });
  }

  /**
   * Binds one method to the element.
   * @param callback
   * @returns {Function}
   */
  bindEvent = (callback) => {
    const that = this;
    return function () {
      callback.apply(that, [this.value, this]);
      that.draw();
    };
  };

  /**
   * API, needs to be implemented by the child element.
   * @returns {Array}
   */
  boundEventMethods () { return [];}

  /**
   * API, needs to be implemented by the child element.
   * Holds the lighterHTML template.
   * @returns {Array}
   */
  draw () {}

  /**
   * A wrapper around redux-watch.
   * The element knows which subscribers there are and unsubscribes them when removed from the DOM.
   * @param objectPath
   * @param callback
   */
  watch (objectPath, callback) {

    if (!Array.isArray(objectPath)) { objectPath = [objectPath] }

    const wrappedWatch = function(objectPath, callback) {
      return Store.subscribe(watch(Store.getState, objectPath)((newVal, oldVal, objectPath) => {
        callback(newVal.get(objectPath), oldVal.get(objectPath));
      }));
    };

    objectPath.forEach(objectPathItem => this.subscribers.push(wrappedWatch(objectPathItem, callback)));
  }

  /**
   * When removed from the DOM unsubscribe all redux subscribers.
   */
  disconnectedCallback () {
    this.subscribers.forEach(unsubscribe => unsubscribe());
  }
}