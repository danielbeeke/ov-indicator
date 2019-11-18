/**
 * This file is in its core a CustomElement but for convenience is it placed in the root of the application.
 */

import {BaseElement} from './Core/BaseElement.js';
import {Store} from './Core/Store.js';
import {html} from "./vendor/lighterhtml.js";

import './vendor/polyfill.js';

import './CustomElements/AppLoader.js';

customElements.define('ov-app', class OvApp extends BaseElement {

  connectedCallback () {
    this.draw();
  }

  draw () {
    let state = Store.getState();

    return html`
      <app-loader class="page ${!['done', 'finished'].includes(state.loadingScreen.phase) ? '' : 'hidden'}"></app-loader>
    `;
  }

});