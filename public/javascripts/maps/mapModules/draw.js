import Draw from 'ol/interaction/Draw';

export const createDraw = (source, selectDrawType) => {
  let drawing;
  const drawValue = selectDrawType.value;
  if (drawValue === 'FreeLine') {
    drawing = new Draw({
      source,
      type: 'LineString',
      freehand: true
    });
  }
  if (drawValue === 'FreePoly') {
    drawing = new Draw({
      source,
      type: 'Polygon',
      freehand: true
    });
  }
  if (drawValue === 'LineString' || drawValue === 'Circle' || drawValue === 'Polygon') {
    drawing = new Draw({
      source,
      type: drawValue
    });
  }
  return drawing;
};

export const addDrawInteraction = (draw, map, type) => {
  if (type !== 'None') {
    return map.addInteraction(draw);
  }
};
