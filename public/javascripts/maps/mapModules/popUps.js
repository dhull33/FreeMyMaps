/* eslint-disable no-underscore-dangle,no-param-reassign,no-undef */
import PopUp from 'ol-popup';

export const Pops = (elementID, id) => {
  return new PopUp({
    id,
    element: document.getElementById(elementID),
    autoPan: true,
    positioning: 'top-center',
    className: 'popup reveal',
    offset: [4, -20],
    insertFirst: false
  });
};
