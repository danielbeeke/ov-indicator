export const dataRefresher = store => next => action => {
  let state = store.getState();

  return next(action)
};