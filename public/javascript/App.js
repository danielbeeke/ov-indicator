import './vendor/polyfill.js';

import './AppLoader.js';

import {BaseElement} from './BaseElement.js';
import {State} from './State.js';
import {html} from "./vendor/lighterhtml.js";

customElements.define('ov-app', class OvApp extends BaseElement {

  connectedCallback () {
    State.watch('loadingPhase', this.draw);
    this.draw();
  }

  draw () {
    let state = State.get();

    return html`
      <app-loader></app-loader>
    `;
  }

});