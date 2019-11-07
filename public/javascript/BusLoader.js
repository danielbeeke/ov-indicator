import {BaseElement} from './BaseElement.js';
import {html} from './vendor/lighterhtml.js';

customElements.define('bus-loader', class BusLoader extends BaseElement {
  constructor () {
    super();

    this.progress = 0;
    this.text = '';

    /**
     * All the phases that are displayed in the loader.
     */
    this.phases = {
      boot: {
        percentage: 5,
        texts: ['Programma starten', 'Booting skynet...', 'Hello', 'Busje komt zo...']
      },
      geoLocation: {
        percentage: 30,
        texts: ['Uitzoeken waar je bent...', 'Waar ben jij dan eigenlijk?']
      },
      busStops: {
        percentage: 60,
        texts: ['Bezig met het laden van bushaltes...', 'Bushalte informatie ophalen...'],
      },
      busTrips: {
        percentage: 90,
        texts: ['Busritten zoeken...', 'Welke bussen zijn er in de buurt?']
      },
      done: {
        percentage: 100,
        texts: ['Woehoe...', 'Daar gaan we!', 'Rijden maar, buschauffeur!']
      },
      noGeolocation: {
        percentage: 0,
        texts: ['Je moet nog even toestemming voor geolocatie verlenen.']
      }
    };

    /**
     * Other components dispatch loading events.
     */
    document.body.addEventListener('loading', event => {
      /**
       * If we know the phase, display the text and set the progressbar.
       */
      if (this.phases[event.detail]) {
        this.text = this.phases[event.detail].texts[Math.floor(Math.random() * this.phases[event.detail].texts.length)];
        this.progress = this.phases[event.detail].percentage + '%';
        this.draw();
      }

      /**
       * When we get the signal done, do an animation and remove this loader.
       */
      if (event.detail === 'done') {
        this.addEventListener('transitionend', () => {
          this.remove();
          document.body.dispatchEvent(new CustomEvent('loading', { detail: 'destroyed' }));
        });

        this.classList.add('done');
      }
    })
  }

  connectedCallback () {
    this.draw();
  }

  /**
   * Our lighterHTML render function.
   * @returns {*}
   */
  draw() {
    return html`
      <div class="progress-bar-wrapper">
        <div class="progress-bar" style="width: ${this.progress}"></div>
        <div class="label">${this.text}</div>
      </div>
    `
  }
});