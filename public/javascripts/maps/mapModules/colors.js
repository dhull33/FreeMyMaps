import colormap from 'colormap';
import { getArea } from 'ol/sphere';
import Circle from 'ol/geom/Circle';

export const clamp = (value, low, high) => {
  return Math.max(low, Math.min(value, high));
};

export const getColor = (feature) => {
  if (feature.getGeometry() instanceof Circle) {
    return 'red';
  }
  const minArea = 1e8;
  const maxArea = 2e13;
  const steps = 72;
  const ramp = colormap({
    colormap: 'hsv',
    nshades: steps,
    format: 'rgbaString',
    alpha: 0.3
  });
  const area = getArea(feature.getGeometry());
  const f = clamp((area - minArea) / (maxArea - minArea), 0, 1) ** (1 / 2);
  const index = Math.round(f * (steps - 1));
  return ramp[index];
};
