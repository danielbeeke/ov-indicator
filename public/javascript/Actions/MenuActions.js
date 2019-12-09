import {Store} from "../Core/Store.js";

/**
 * Toggles the menu state
 */
export const toggleMenu = () => {
  Store.dispatch({
    type: 'toggle-menu'
  });
};