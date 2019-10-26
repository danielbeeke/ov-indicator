import {render} from 'https://unpkg.com/lighterhtml?module';

export class BaseElement extends HTMLElement {
  constructor () {
    super();

    this.draw = render.bind(this, this, this.draw);

    this.boundEventMethods().forEach(boundEventName => {
      if (this[boundEventName]) {
        this[boundEventName] = this.bindEvent(this[boundEventName]);
      }
    });
  }

  boundEventMethods () {
     return [];
  }

  bindEvent = (callback) => {
    let that = this;
    return function () {
      callback.apply(that, [this.value, this]);
      that.draw();
    };
  };

  draw () {}

}