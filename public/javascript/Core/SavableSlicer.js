export const savableSlicer = (paths) => {
  return (state) => {
    return {
      tripSelector: {
        favoriteStops: state.tripSelector.favoriteStops,
        favoriteTrips: state.tripSelector.favoriteTrips
      }
    };
  }
};