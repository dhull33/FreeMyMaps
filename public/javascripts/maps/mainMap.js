/* eslint-disable prefer-destructuring,no-shadow,no-plusplus,no-undef,no-underscore-dangle,prettier/prettier */
import 'ol/ol.css';
import { defaults as defaultControls } from 'ol/control';
import { Modify, Snap } from 'ol/interaction';
import Map from 'ol/Map';
import { fromLonLat, transform as Transform } from 'ol/proj';
import { Icon, Stroke, Style, Fill } from 'ol/style';
import Geocoder from 'ol-geocoder';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
// TODO: Display drag and drop data on map
import DragAndDrop from 'ol/interaction/DragAndDrop';
import { GPX, GeoJSON, IGC, KML, TopoJSON } from 'ol/format';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import View from 'ol/View';
import makeTheseLayers from './mapModules/layers';
import { selectYourMap, selectYourDrawType } from './mapModules/controls';
import { createDraw, addDrawInteraction } from './mapModules/draw';
import { Pops } from './mapModules/popUps';
import { downloadPNG, downloadGEO } from './mapModules/export';
import { getColor } from './mapModules/colors';

const appId = 'BLd5jWBS0s57akvRPg97';
const appCode = 'hdgWeUmZ_Tqb2a2ymt3YbA';

// eslint-disable-next-line consistent-return
$(document).ready(async () => {
  // TODO: Load 1st saved map for user here

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
    style: (feature) => {
      return new Style({
        stroke: new Stroke({
          color: 'black',
          width: 1.5
        }),
        fill: new Fill({
          color: getColor(feature)
        })
      });
    }
  });
  map.addLayer(layer);

  /*
 ============================
 CHANGES THE SELECTED MAP LAYER
 ===========================
 */

  // Enables the user to select which map to display
  // mapModules/controls.js
  map.addControl(selectYourMap);

  const select = document.getElementById('layer-select');
  const onChange = () => {
    const scheme = select.value;
    for (let i = 0, ii = layers.length; i < ii; ++i) {
      layers[i].setVisible(theseAwesomeLayers[i].scheme === scheme);
    }
  };

  select.addEventListener('change', onChange);

  onChange();

  /*
   ===================================================================
   Download as png & GeoJSON data
   =====================================================================
   */
  downloadPNG(map, 'export-png');
  downloadGEO(source, 'download-geo');

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
    const coord = evt.coordinate;
    const address = evt.address;
    // PopUp from ol-popup
    const geoPop = Pops('map-marker-popup', 'geoPop');
    map.addOverlay(geoPop);
    window.setTimeout(() => {
      geoPop.show(coord, address.formatted);
    }, 300);
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
        src: '/images/icons/map_pin_48px.png'
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
  // TODO: display information on map
  map.addInteraction(
    new DragAndDrop({
      source,
      formatConstructors: [GPX, GeoJSON, IGC, KML, TopoJSON]
    })
  );

  /*
   ===================================================================
   Displays Mouse Point Coordinates
   =====================================================================
   */
  const mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: 'EPSG:4326',
    undefinedHTML: ''
  });
  map.addControl(mousePositionControl);

  /*
   ===================================================================
   Modify
   =====================================================================
   */
  const modify = new Modify({ source });
  map.addInteraction(modify);

  /*
   ===================================================================
   Drawing
   ./mapModules/draw.js
   =====================================================================
   */
  const selectDrawType = document.getElementById('draw-type');
  let draw = createDraw(source, selectDrawType);

  selectDrawType.onchange = () => {
    map.removeInteraction(draw);
    draw = createDraw(source, selectDrawType);
    addDrawInteraction(draw, map, selectDrawType.value);
  };

  addDrawInteraction(draw, map, selectDrawType.value);

  map.addControl(selectYourDrawType);
  /*
   ===================================================================
   Snap Interaction: needs to be added after the draw and modify interactions
   in order for its map browser event handlers to be fired first
   =====================================================================
   */
  const snap = new Snap({
    source: layer.getSource()
  });
  map.addInteraction(snap);
});
