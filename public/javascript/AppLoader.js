import {BaseElement} from './core/BaseElement.js';
import {html} from './vendor/lighterhtml.js';
import {State} from "./core/StateManager.js";

customElements.define('app-loader', class AppLoader extends BaseElement {

  connectedCallback () {
    State.watch('loadingPhase', (newPhase) => {
      let text = newPhase.texts[Math.floor(Math.random() * newPhase.texts.length)];
      let progress = newPhase.percentage + '%';
      let phase = newPhase.name;
      this.draw(phase, text, progress);
    });
  }

  /**
   * Our lighterHTML render function.
   * @returns {*}
   */
  draw (phase = '', text = '', progress = 0) {
    return html`
      <div class="progress-bar-wrapper${phase === ' done' ? 'done' : ''}">
        <div class="progress-bar" style="width: ${progress}"></div>
        <div class="label">${text}</div>
      </div>
    `
  }
});