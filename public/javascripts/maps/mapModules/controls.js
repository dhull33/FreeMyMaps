import { Control } from 'ol/control';

export const selectMap = new Control({
  element: document.getElementById('layer-select'),
  target: document.getElementById('select-target')
});

export const drawType = new Control({
  element: document.getElementById('type'),
  target: document.getElementById('draw-type')
});

export const whatKindOfHand = new Control({
  element: document.getElementById('free-or-nah'),
  target: document.getElementById('which-hand')
});

export const addNewControl = (elementID, targetID) => {
  return new Control({
    element: document.getElementById(elementID),
    target: document.getElementById(targetID)
  });
};
