import {BaseElement} from './BaseElement.js';
import {html} from './vendor/lighterhtml.js';
import {Store} from './Store.js';

customElements.define('bus-loader', class BusLoader extends BaseElement {
  constructor () {
    super();

    this.progress = 0;
    this.text = '';
    this.phase = '';

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

    Store.watch('loadingPhase', (newPhase) => {
      this.phase = newPhase;
      if (this.phases[newPhase]) {
        this.text = this.phases[newPhase].texts[Math.floor(Math.random() * this.phases[newPhase].texts.length)];
        this.progress = this.phases[newPhase].percentage + '%';
        this.draw();
      }

      if (newPhase === 'done') {
        this.addEventListener('transitionend', () => {
          Store.trigger('loadingPhase', 'destroyed');
          this.remove();
        });
      }
    });
  }

  /**
   * Our lighterHTML render function.
   * @returns {*}
   */
  draw() {
    return html`
      <div class="progress-bar-wrapper ${this.newPhase === 'done' ? 'done' : ''}">
        <div class="progress-bar" style="width: ${this.progress}"></div>
        <div class="label">${this.text}</div>
      </div>
    `
  }
});