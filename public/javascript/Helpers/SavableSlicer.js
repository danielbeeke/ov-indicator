export const savableSlicer = (paths) => {
  return (state) => {
    return {
      tripSelector: {
        favoriteStops: state.tripSelector.favoriteStops,
        favoriteTrips: state.tripSelector.favoriteTrips
      },
      indicator: {
        averageWalkingSpeed: state.indicator.averageWalkingSpeed,
        prepareMinutes: state.indicator.prepareMinutes
      }
    };
  }
};