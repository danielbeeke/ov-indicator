const phaseInformation = {
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

export const loadingPhaseEnhancer = store => next => action => {

  if (action.type === 'change-loading-phase') {
      if (phaseInformation[action.phase]) {
        action.text = phaseInformation[action.phase].texts[Math.floor(Math.random() * phaseInformation[action.phase].texts.length)];
        action.percentage = phaseInformation[action.phase].percentage;
      }
      else {
        throw `Unknown phase, no enhancement found for: ${action.phase}`
      }
  }

  return next(action)
};