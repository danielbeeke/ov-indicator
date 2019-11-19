const phaseInformation = {
  boot: {
    percentage: 5,
    texts: ['Programma starten', 'Booting skynet...', 'Hello', 'Busje komt zo...']
  },
  geolocation: {
    percentage: 30,
    texts: ['Uitzoeken waar je bent...', 'Waar ben jij dan eigenlijk?'],
  },
  loadingStops: {
    percentage: 50,
    texts: ['Bezig met het laden van bushaltes...', 'Bushalte informatie ophalen...'],
  },
  loadingTrips: {
    percentage: 70,
    texts: ['Busritten zoeken...', 'Welke bussen zijn er in de buurt?']
  },
  done: {
    percentage: 100,
    texts: ['Woehoe...', 'Daar gaan we!', 'Rijden maar, buschauffeur!']
  },
  error: {
    percentage: 0,
    texts: ['Er ging iets mis, heb je wel internet?']
  },
  geoError: {
    percentage: 0,
    texts: ['Je moet nog even toestemming voor geolocatie verlenen.']
  }
};

/**
 * Adds loading phase information to the actions, so we can display a nice progressbar.
 */
export const loadingPhaseEnhancerMiddleware = () => next => action => {
  if (action.type === 'change-loading-phase') {
    const newPhase = action.payload.phase;

    if (phaseInformation[newPhase]) {
      action.payload.text = phaseInformation[newPhase].texts[Math.floor(Math.random() * phaseInformation[newPhase].texts.length)];
      action.payload.percentage = phaseInformation[newPhase].percentage;
    }
    else {
      throw `Unknown phase, no enhancement found for: ${newPhase}`
    }
  }

  return next(action)
};