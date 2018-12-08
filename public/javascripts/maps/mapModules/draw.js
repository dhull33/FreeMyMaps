import Draw from 'ol/interaction/Draw';

export const createDraw = (source, selectDrawType) => {
  let draw;
  const drawValue = selectDrawType.value;
  if (drawValue === 'FreeLine') {
    draw = new Draw({
      source,
      type: 'LineString',
      freehand: true
    });
  }
  if (drawValue === 'FreePoly') {
    draw = new Draw({
      source,
      type: 'Polygon',
      freehand: true
    });
  }
  if (drawValue === 'LineString' || drawValue === 'Circle' || drawValue === 'Polygon') {
    draw = new Draw({
      source,
      type: drawValue
    });
  }
  return draw;
};
