import {BaseElement} from './BaseElement.js';
import {html} from './vendor/lighterhtml.js';
import {State} from './State.js';

customElements.define('app-loader', class AppLoader extends BaseElement {
  constructor () {
    super();

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

    State.watch('loadingPhase', (newPhase) => {
      if (this.phases[newPhase]) {
        let text = this.phases[newPhase].texts[Math.floor(Math.random() * this.phases[newPhase].texts.length)];
        let progress = this.phases[newPhase].percentage + '%';
        this.draw(text, progress);
      }
    });

    State.transaction('updatePreLoader', nextState => nextState.loadingPhase = 'boot2');
  }

  /**
   * Our lighterHTML render function.
   * @returns {*}
   */
  draw(text, progress) {
    return html`
      <div class="progress-bar-wrapper ${this.phase === 'done' ? 'done' : ''}">
        <div class="progress-bar" style="width: ${this.progress}"></div>
        <div class="label">${this.text}</div>
      </div>
    `
  }
});