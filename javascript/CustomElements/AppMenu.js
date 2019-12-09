import {BaseElement} from '../Core/BaseElement.js';
import {html} from '../vendor/lighterhtml.js';
import {Store} from '../Core/Store.js';
import {toggleMenu} from '../Actions/MenuActions.js';
import {setAverageWalkingSpeed, setPrepareMinutes} from '../Actions/IndicatorActions.js';

/**
 * Shows the menu.
 */
customElements.define('app-menu', class AppMenu extends BaseElement {

  /**
   * When our custom element is placed inside the DOM.
   */
  connectedCallback() {
    this.watch(['menu.expanded', 'indicator.averageWalkingSpeed'], () => this.draw());
    this.draw();
  }

  /**
   * Our lighterHTML render function.
   * The text and progress is set by loadingPhaseEnhancerMiddleware
   * @returns {*}
   */
  draw() {
    const s = Store.getState().menu;
    const i = Store.getState().indicator;
    const averageSpeed = (i.averageWalkingSpeed / 1000).toString().replace('.', ',');

    return html`
      <div class="menu-toggle ${s.expanded ? 'expanded' : ''}" onclick="${toggleMenu}">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
      <div class="menu-wrapper ${s.expanded ? 'expanded' : ''}">
      
        <div class="settings">

          <div class="form-item">
            <span class="label">Mijn voorbereid tijd: ${i.prepareMinutes} minuten</span>
            <input type="range" oninput="${e => setPrepareMinutes(e.target.value)}" value="${i.prepareMinutes}" min="0" step="1" max="30">                  
          </div>
      
          <div class="form-item">
            <span class="label">Mijn wandelsnelheid: ${averageSpeed} km/u</span>
            <input type="range" oninput="${e => setAverageWalkingSpeed(e.target.value)}" value="${i.averageWalkingSpeed}" min="2000" step="250" max="10000">                  
          </div>

        </div>

        <div class="build-by">Ontwikkeld door <a href="https://danielbeeke.nl" target="_blank">Daniël Beeke</a>,<br>Open source project, code op <a href="https://github.com/danielbeeke/ov-indicator" target="_blank">github</a></div>
      </div>
    `
  }
});