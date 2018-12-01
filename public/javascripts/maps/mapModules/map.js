// Creating the map object
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control/util';
import { transform as Transform } from 'ol/proj';
import axios from 'axios';

export const defaultMap = (layers, coords) => {
  const transCoords = Transform([-98.569336, 39.774769], 'EPSG:4326', 'EPSG:3857');
  let zoomed;
  if (coords[0] === transCoords[0] && coords[1] === transCoords[1]) {
    zoomed = 4;
  } else {
    zoomed = 10;
  }
  const map = new Map({
    target: 'map',
    layers,
    view: new View({
      center: coords,
      zoom: zoomed
    }),
    controls: defaultControls({
      zoom: true,
      attribution: true
    })
  });
  return map;
};

export const saveMap = async (center, jsonFeatures) => {
  const path = window.location.pathname;
  const splitProp = path.split('/');
  // console.log(path);
  if (splitProp[1] === 'hunt-clubs') {
    const clubId = splitProp[2];
    const mapId = splitProp[3];
    try {
      const saveClubMap = await axios.post(`/hunt-clubs/${clubId}/save/${mapId}`, {
        clubCenter: center,
        features: jsonFeatures
      });
      // console.log('======SAVING MAP======');
      // console.log(saveClubMap);
      return saveClubMap.data;
    } catch (error) {
      console.log(error);
    }
  } else {
    const propertyId = splitProp[2];
    try {
      const saveProperty = await axios.post(`/save/${propertyId}/map`, {
        propertyId,
        propertyCenter: center,
        features: jsonFeatures
      });
      // console.log(saveProperty);
      return saveProperty.data;
    } catch (error) {
      console.log(error);
    }
  }
};
