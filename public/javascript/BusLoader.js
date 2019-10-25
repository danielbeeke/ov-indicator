customElements.define('bus-loader', class BusLoader extends HTMLElement {
  constructor () {
    super();

    this.label = document.createElement('span');
    this.label.classList.add('label');

    this.progressBarWrapper = document.createElement('div');
    this.progressBarWrapper.classList.add('progress-bar-wrapper');

    this.progressBar = document.createElement('div');
    this.progressBar.classList.add('progress-bar');
    this.progressBar.style.width = '0%';
    this.progressBarWrapper.appendChild(this.progressBar)

    this.image = document.createElement('img');
    this.image.src = 'img/bus-animation.gif';
    this.image.classList.add('loading-animation');

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
        this.label.innerText = this.phases[event.detail].text;
        this.progressBar.style.width = this.phases[event.detail].percentage + '%';
      }
    })
  }

  connectedCallback () {
    this.appendChild(this.image);
    this.appendChild(this.label);
    this.appendChild(this.progressBarWrapper);
  }
});