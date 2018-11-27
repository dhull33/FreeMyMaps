/* eslint-disable no-param-reassign,no-underscore-dangle */
// Dynamic styling
import colormap from 'colormap';
import { getArea } from 'ol/sphere';
import { Fill, Stroke, Style } from 'ol/style';
import { LineString, Polygon } from 'ol/geom';
import { unByKey } from 'ol/Observable';

export const clamp = (value, low, high) => {
  return Math.max(low, Math.min(value, high));
};

// Changes color of drawn polygons based on size
// This function determines the size of the polygon
export const getColor = (feature) => {
  const min = 72845; // the smallest area
  const max = 80937128; // the biggest area
  const steps = 72;
  const ramp = colormap({
    colormap: 'hsv',
    nshades: steps,
    format: 'rgbaString',
    alpha: 0.1
  });
  const area = getArea(feature.getGeometry());
  // console.log(area);
  const f = clamp((area - min) / (max - min), 0, 1) ** (1 / 2);
  const index = Math.round(f * (steps - 1));
  // console.log(index);
  return ramp[index];
};

export const setLineColor = (map, lineColor) => {
  let listenForColorChange;
  return $('#line-color-palette').on('click', (event) => {
    lineColor = event.target.id;
    listenForColorChange = map.on('click', (evt) => {
      map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        let newStyle;
        if (feature) {
          console.log(feature);
          feature.values_.lineColor = lineColor;
          const featGeom = feature.getGeometry();
          if (featGeom instanceof LineString) {
            newStyle = new Style({
              geometry: featGeom,
              stroke: new Stroke({
                color: lineColor,
                width: 3
              })
            });
            feature.setStyle(newStyle);
          } else if (featGeom instanceof Polygon) {
            if (feature.values_.fillColor !== undefined) {
              newStyle = new Style({
                geometry: featGeom,
                fill: new Fill({
                  color: feature.values_.fillColor
                }),
                stroke: new Stroke({
                  color: lineColor,
                  width: 3
                })
              });
            } else {
              newStyle = new Style({
                geometry: featGeom,
                stroke: new Stroke({
                  color: lineColor,
                  width: 3
                })
              });
            }
            feature.setStyle(newStyle);
          }
        }
      });
      unByKey(listenForColorChange);
    });
    return lineColor;
  });
};

export const setFillColor = (map, fillColor) => {
  let listenForFillChange;
  $('#fill-color-palette').on('click', (event) => {
    fillColor = event.target.id;
    listenForFillChange = map.on('click', (evt) => {
      map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        if (feature) {
          // console.log(feature);
          const featGeom = feature.getGeometry();
          // const featStyle = feature.getStyle();
          if (featGeom instanceof Polygon) {
            feature.values_.fillColor = fillColor;
            if (feature.values_.lineColor !== undefined) {
              const newStyle = new Style({
                geometry: featGeom,
                fill: new Fill({
                  color: fillColor
                }),
                stroke: new Stroke({
                  color: feature.values_.lineColor,
                  width: 3
                })
              });
              feature.setStyle(newStyle);
            } else {
              const polyStyle = new Style({
                geometry: featGeom,
                fill: new Fill({
                  color: fillColor
                }),
                stroke: new Stroke({
                  color: 'black',
                  width: 3
                })
              });
              feature.setStyle(polyStyle);
            }
          }
        }
      });
      unByKey(listenForFillChange);
    });
  });
};
