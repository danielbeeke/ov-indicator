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

export const getGeoPermission = () => {
  Store.dispatch({
    type: 'get-geo-permission',
    payload: navigator.permissions.query({name:'geolocation'}).then(result => {
      return result.state ? result.state : (result.status ? result.status : null);
    })
  })
};
