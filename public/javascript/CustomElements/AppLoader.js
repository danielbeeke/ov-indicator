import {BaseElement} from '../Core/BaseElement.js';
import {html} from '../vendor/lighterhtml.js';
import {Store} from '../Core/Store.js';

/**
 * Shows a progressbar showing the loading progress of the app.
 */
customElements.define('app-loader', class AppLoader extends BaseElement {

  /**
   * When our custom element is placed inside the DOM.
   */
  connectedCallback() {
    this.watch('loadingScreen.phase', () => this.draw());
  }

  /**
   * Our lighterHTML render function.
   * The text and progress is set by loadingPhaseEnhancerMiddleware
   * @returns {*}
   */
  draw() {
    const s = Store.getState().loadingScreen;

    return html`
      <div class="progress-bar-wrapper${s.phase === ' done' ? 'done' : ''}">
        <div class="progress-bar" style="width: ${s.percentage}%"></div>
        <div class="label">${s.text}</div>
      </div>
    `
  }
});