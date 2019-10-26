import {BaseElement} from './BaseElement.js';
import {html} from 'https://unpkg.com/lighterhtml?module';

customElements.define('bus-loader', class BusLoader extends BaseElement {
  constructor () {
    super();

    this.progress = 0;
    this.text = '';

    this.phases = {
      boot: {
        percentage: 5,
        text: 'Programma starten'
      },
      geoLocation: {
        percentage: 30,
        text: 'Uitzoeken waar je bent...'
      },
      busStops: {
        percentage: 60,
        text: 'Bezig met het laden van bushaltes...',
      },
      busTrips: {
        percentage: 90,
        text: 'Busritten zoeken...'
      },
      done: {
        percentage: 100,
        text: 'Woehoe...'
      }
    };

    document.body.addEventListener('loading', event => {
      if (event.detail === 'done') {
        this.addEventListener('transitionend', () => {
          this.remove();
          document.body.dispatchEvent(new CustomEvent('loading', { detail: 'destroyed' }));
        });

        this.classList.add('done');
      }

      if (this.phases[event.detail]) {
        this.text = this.phases[event.detail].text;
        this.progress = this.phases[event.detail].percentage + '%';
        this.draw();
      }
    })
  }

  connectedCallback () {
    this.draw();
  }

  draw() {
    return html`
      <img src="img/bus-animation.gif" class="loading-animation">

      <div class="progress-bar-wrapper">
        <div class="progress-bar" style="width: ${this.progress}"></div>
        <div class="label">${this.text}</div>
      </div>
    `
  }
});