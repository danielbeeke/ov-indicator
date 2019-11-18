import {BaseElement} from '../Core/BaseElement.js';
import {html} from '../vendor/lighterhtml.js';
import {Store} from '../Core/Store.js';
import {changeLoadingPhase} from "../Actions/LoadingScreen.js";

customElements.define('app-loader', class AppLoader extends BaseElement {

  /**
   * When our custom element is placed inside the DOM.
   */
  connectedCallback() {
    this.watch('loadingScreen.phase', () => this.draw());
    changeLoadingPhase('boot');
  }

  /**
   * Our lighterHTML render function.
   * @returns {*}
   */
  draw() {
    let s = Store.getState().loadingScreen;

    return html`
      <div class="progress-bar-wrapper${s.phase === ' done' ? 'done' : ''}">
        <div class="progress-bar" style="width: ${s.progress}%"></div>
        <div class="label">${s.text}</div>
      </div>
    `
  }
});