import {Store} from "../Core/Store.js";

export const goOnline = () => {
  Store.dispatch({
    type: 'go-online',
  })
};

export const goOffline = () => {
  Store.dispatch({
    type: 'go-offline',
  })
};