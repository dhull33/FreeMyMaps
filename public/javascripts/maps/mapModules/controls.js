import { Control } from 'ol/control';

export const selectYourMap = new Control({
  element: document.getElementById('layer-select'),
  target: document.getElementById('select-target')
});

export const selectYourDrawType = new Control({
  element: document.getElementById('type'),
  target: document.getElementById('draw-type')
});
