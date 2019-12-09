import {BaseElement} from '../Core/BaseElement.js';
import {html} from '../vendor/lighterhtml.js';
import {Store} from '../Core/Store.js';
import {toggleMenu} from '../Actions/MenuActions.js';

/**
 * Shows the menu.
 */
customElements.define('app-menu', class AppMenu extends BaseElement {

  /**
   * When our custom element is placed inside the DOM.
   */
  connectedCallback() {
    this.watch('menu.expanded', () => this.draw());
    this.draw();
  }

  /**
   * Our lighterHTML render function.
   * The text and progress is set by loadingPhaseEnhancerMiddleware
   * @returns {*}
   */
  draw() {
    const s = Store.getState().menu;

    return html`
      <div class="menu-toggle ${s.expanded ? 'expanded' : ''}" onclick="${toggleMenu}">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
      <div class="menu-wrapper ${s.expanded ? 'expanded' : ''}">
        <a class="menu-link">Over deze app</a>
        <a class="menu-link">Privacy statement</a>
        <div class="build-by">Ontwikkeld door <a href="https://danielbeeke.nl" target="_blank">Daniël Beeke</a>,<br>Open source project, code op <a href="https://github.com/danielbeeke/ov-indicator" target="_blank">github</a></div>
      </div>
    `
  }
});