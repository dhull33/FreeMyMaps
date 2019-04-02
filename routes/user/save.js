import GeoJSON from 'ol/format/GeoJSON';
import axios from 'axios';

const save = (center, featuresAsJson) => {};

export default (map, source) => {
  return $('#save').click(() => {
    const format = new GeoJSON();
    const center = map.getView().getCenter();
    const features = source.getFeatures();
    const featuresAsJson = format.writeFeatures(features);
    return save(center, featuresAsJson);
  });
};
