/* eslint-disable prefer-destructuring,no-shadow,no-plusplus,no-undef,no-underscore-dangle,prettier/prettier */
import 'ol/ol.css';
import { defaults as defaultControls } from 'ol/control/util';
import { defaults as defaultInteractions } from 'ol/interaction';
import Map from 'ol/Map';
import { fromLonLat, transform as Transform } from 'ol/proj';
import { Icon, Stroke, Style } from 'ol/style';
import Geocoder from 'ol-geocoder';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import View from 'ol/View';
import makeTheseLayers from './mapModules/layers';
import { selectYourMap } from './mapModules/controls';

const appId = '5uYRdU92ZZBGTmh7cSJA';
const appCode = 'W_mc_u3M-N76CJEDLk7FKA';

// eslint-disable-next-line consistent-return
$(document).ready( () => {

  //  Layers for maps
  const theseAwesomeLayers = [
    {
      base: 'base',
      type: 'maptile',
      scheme: 'normal.day',
      app_id: appId,
      app_code: appCode
    },
    {
      base: 'base',
      type: 'maptile',
      scheme: 'normal.day.transit',
      app_id: appId,
      app_code: appCode
    },
    {
      base: 'base',
      type: 'maptile',
      scheme: 'pedestrian.day',
      app_id: appId,
      app_code: appCode
    },
    {
      base: 'aerial',
      type: 'maptile',
      scheme: 'hybrid.day',
      app_id: appId,
      app_code: appCode
    },
    {
      base: 'aerial',
      type: 'maptile',
      scheme: 'terrain.day',
      app_id: appId,
      app_code: appCode
    },
    {
      base: 'aerial',
      type: 'maptile',
      scheme: 'satellite.day',
      app_id: appId,
      app_code: appCode
    },
    {
      scheme: 'topo.day'
    },
    {
      scheme: 'topo.image'
    }
  ];

  const coords = Transform([-98.569336, 39.774769], 'EPSG:4326', 'EPSG:3857');
  // initialize map, layers, and source
  const layers = makeTheseLayers(theseAwesomeLayers);
  
  const map = new Map({
    interactions: defaultInteractions({
      onFocusOnly: true
    }),
    target: 'map',
    layers,
    view: new View({
      center: coords,
      zoom: 5
    }),
    controls: defaultControls({
      zoom: true,
      attribution: true
    })
  });
  
  // Create source and layer for user location and drawings
  const source = new VectorSource();
  const layer = new VectorLayer({
    source,
    style: new Style({
      stroke: new Stroke({
        color: 'black',
        width: 2
      })
    })
  });
  map.addLayer(layer);
  
  // Enables the user to select which map to display on screen
  map.addControl(selectYourMap);

  /*
 ============================
 CHANGES THE SELECTED LAYER
 ===========================
 */
  const select = document.getElementById('layer-select');
  const onChange = () => {
    const scheme = select.value;
    for (let i = 0, ii = layers.length; i < ii; i += 1) {
      layers[i].setVisible(theseAwesomeLayers[i].scheme === scheme);
    }
  };

  onChange();

  $('#layer-select').on('change', () => {
    const scheme = select.value;
    for (let i = 0, ii = layers.length; i < ii; i += 1) {
      layers[i].setVisible(theseAwesomeLayers[i].scheme === scheme);
    }
  });

  /*
   * ==============================
   * ======GEOCODER================
   * ==============================
   */
  const mapGeocoder = new Geocoder('nominatim', {
    provider: 'osm',
    lang: 'en',
    targetType: 'glass-button',
    placeholder: 'Search for ...',
    limit: 8,
    autoComplete: true,
    keepOpen: true
  });
  map.addControl(mapGeocoder);
  
  mapGeocoder.on('addresschosen', (evt) => {
    console.log(evt)
  });

  // ================================
  // ===========GEOLOCATION==========
  // ================================
  
  navigator.geolocation.getCurrentPosition((position) => {
    const coordinates = fromLonLat([position.coords.longitude, position.coords.latitude]);
    const theirLocation = new Feature({
      geometry: new Point(coordinates)
    });
    const locationStyling = new Style({
      image: new Icon({
        src: '/images/icons/person_pin_circle_48px.png'
      })
    });
    theirLocation.setStyle(locationStyling);
    source.addFeature(theirLocation);
  });

  /*
  ===================================================================
  Drag and drop GeoJson data to display over map
 =====================================================================
 */
  map.addInteraction(
    new DragAndDrop({
      source,
      formatConstructors: [GeoJSON]
    })
  );
  

  const mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: 'EPSG:4326',
    undefinedHTML: ''
  });
  map.addControl(mousePositionControl);
  
});
