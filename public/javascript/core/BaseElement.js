import {render} from '../vendor/lighterhtml.js';

export class BaseElement extends HTMLElement {
  constructor () {
    super();
    let elementDraw = this.draw;

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
}