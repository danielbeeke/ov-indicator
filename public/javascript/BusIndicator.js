import {BaseElement} from './BaseElement.js';
import {html} from 'https://unpkg.com/lighterhtml?module';

customElements.define('bus-indicator', class BusIndicator extends BaseElement {
  constructor () {
    super();

    document.body.addEventListener('loading', event => {
      if (event.detail === 'destroyed') {
        this.classList.remove('hidden')
      }
    });

    document.body.addEventListener('selectedData', event => {
      console.log(event.detail)
    });
  }

  connectedCallback () {
    this.draw();
  }

  draw () {
    return html`
      <span>test</span>
    `
  }
});