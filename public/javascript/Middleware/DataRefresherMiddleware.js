/**
 * Refreshes the geolocation, stops and trips data when:
 *
 * - The device went offline and online again.
 * - The user walked more than N meters.
 * - The last refresh was more than N seconds ago.
 */
export const dataRefresherMiddleware = store => next => action => {
  const state = store.getState();
  return next(action)
};