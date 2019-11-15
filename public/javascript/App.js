import {BaseElement} from './core/BaseElement.js';
import {State} from "./core/StateManager.js";
import {html} from "./vendor/lighterhtml.js";

import './vendor/polyfill.js';

import './AppLoader.js';
import './BusSelector.js';

customElements.define('ov-app', class OvApp extends BaseElement {

  connectedCallback () {
    State.watch('loadingPhase', () => this.draw());
    navigator.serviceWorker.register('/service-worker.js');
  }

  draw () {
    let state = State.get();

    return html`
      <app-loader class="page ${!['done', 'finished'].includes(state.loadingPhase.name) ? '' : 'hidden'}"></app-loader>
      <div class="page">
        <bus-selector class="${state.loadingPhase.name === 'finished' ? '' : 'hidden'}"></bus-selector>
        ${state.currentIndication === 'coffee' ? html`<indication-coffee />` : ''}
      </div>
    `;
  }

});