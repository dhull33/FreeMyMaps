/* eslint-disable prefer-destructuring,no-shadow,no-plusplus,no-undef,no-underscore-dangle,prettier/prettier */
import 'ol/ol.css';
import { fromLonLat, transform as Transform } from 'ol/proj';
import sync from 'ol-hashed';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import Draw from 'ol/interaction/Draw';
import Snap from 'ol/interaction/Snap';
import { Fill, Icon, Stroke, Style } from 'ol/style';
import Geocoder from 'ol-geocoder';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import CircleStyle from 'ol/style/Circle';
import Overlay from 'ol/Overlay';
import { LineString, Polygon } from 'ol/geom';
import { getArea, getLength } from 'ol/sphere';
import { unByKey } from 'ol/Observable';
import uniqid from 'uniqid';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import { setLineColor, setFillColor } from './mapModules/getColor';
import createLayers from './mapModules/createLayers';
import { defaultMap, saveMap } from './mapModules/map';
import { selectMap, drawType, whatKindOfHand } from './mapModules/controls';
import { moveToMap } from './mapModules/markers';
import { PoPUp, submitPopUpForm } from './mapModules/popUp';
// eslint-disable-next-line import/named
// import { getFeaturesFromBackEnd } from './mapModules/getSourceFeatures';
import moveModifyErase from './mapModules/editFeatures';

const appId = '5uYRdU92ZZBGTmh7cSJA';
const appCode = 'W_mc_u3M-N76CJEDLk7FKA';

// eslint-disable-next-line consistent-return
$(document).ready(async () => {
  // const theProperty = await getFeaturesFromBackEnd();
  // console.log('==========THEPROPERTY==========')
  // console.log(theProperty);
  let features;
  let mapCenterString;
  // if (theProperty.map_features !== null && theProperty.map_features !== '') {
  //   features = theProperty.map_features;
  //   mapCenterString = theProperty.map_center;
  // }
  // let coords;
  // if (mapCenterString === '' || mapCenterString === null || mapCenterString === undefined) {
  //   coords = Transform([-98.569336, 39.774769], 'EPSG:4326', 'EPSG:3857');
  // } else {
  //   const splitCenter = mapCenterString.split(/[^-.0123456789]/);
  //   const longitude = parseFloat(splitCenter[1]);
  //   const latitude = parseFloat(splitCenter[2]);
  //   coords = [longitude, latitude];
  // }

  // Creating HERE Layers
  const hereLayers = [
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
      base: 'aerial',
      type: 'maptile',
      scheme: 'hybrid.day',
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
  const layers = createLayers(hereLayers);
  const map = defaultMap(layers, coords);

  // Remove double click zoom interaction
  const interactArray = map.getInteractions().array_;
  const dblClickZoom = interactArray[1];
  map.removeInteraction(dblClickZoom);

  const format = new GeoJSON();
  const source = new VectorSource();

  // checks if blank map or nah
  let jsonFeatures;
  let realFeatures;
  if (features !== null && features !== undefined) {
    jsonFeatures = JSON.parse(features);
    realFeatures = format.readFeatures(jsonFeatures);

    // Add saved features to source
    for (let k = 0; k < realFeatures.length; k += 1) {
      const myFeature = realFeatures[k];
      const featureGeometry = myFeature.getGeometry();
      // Adds icon to marker feature
      if (featureGeometry instanceof Point) {
        let iconPath;
        if (myFeature.id_ === 'userLocation') {
          iconPath = '/images/icons/orange-dot.png';
        } else {
          iconPath = myFeature.values_.path;
        }
        // console.log(iconPath);
        const icon = new Style({
          image: new Icon({
            src: iconPath
          })
        });
        myFeature.setStyle(icon);
        // add appropriate pop-up to feature
        const popUp = PoPUp('map-marker-popup', myFeature.values_.id);
        popUp.content.innerHTML = `<div class="popup-wrapper">\n
                    <div class="popup-body">
                      <span class="marker-type" style="color: ${myFeature.values_.iconColor}">
                        <embed type="image/svg+xml" src="${myFeature.values_.popUpIcon}"/>
                        ${myFeature.values_.markerTitle}
                      </span>
                      <form id="pop-up-form" class="popup-form">
                        <input id="marker-name-${myFeature.values_.id}" data-name="markName"
                        placeholder="Marker Name (Required)" value="${myFeature.values_.name}">
                        <textarea id="marker-notes-${
                          myFeature.values_.id
                        }" data-notes="markNotes" placeholder="Notes (Optional)">${
          myFeature.values_.notes
        }</textarea>
                        <span class="button-wrapper">
                          <button id="markerButton" data-submit="true" type="submit">
                            <i class="fas fa-plus"></i>
                            Add to Property
                          </button>
                        </span>
                      </form>
                     </div>
                    </div>`;
        map.addOverlay(popUp);
        submitPopUpForm(myFeature, popUp, format, source, coords);
      }
      if (featureGeometry instanceof Polygon || featureGeometry instanceof LineString) {
        let renderedStyle;
        if (
          myFeature.values_.fillColor !== undefined &&
          myFeature.values_.lineColor !== undefined
        ) {
          renderedStyle = new Style({
            geometry: featureGeometry,
            fill: new Fill({
              color: myFeature.values_.fillColor
            }),
            stroke: new Stroke({
              color: myFeature.values_.lineColor,
              width: 3
            })
          });
        } else if (
          myFeature.values_.lineColor !== undefined &&
          myFeature.values_.fillColor === undefined
        ) {
          renderedStyle = new Style({
            geometry: featureGeometry,
            stroke: new Stroke({
              color: myFeature.values_.lineColor,
              width: 3
            })
          });
        } else if (
          myFeature.values_.lineColor === undefined &&
          myFeature.values_.fillColor !== undefined
        ) {
          renderedStyle = new Style({
            geometry: featureGeometry,
            fill: new Fill({
              color: myFeature.values_.fillColor
            }),
            stroke: new Stroke({
              color: 'black',
              width: 3
            })
          });
        }
        myFeature.setStyle(renderedStyle);

        const alreadyMeasuredElement = document.createElement('div');
        alreadyMeasuredElement.className = 'tooltip tooltip-static';
        alreadyMeasuredElement.innerHTML = myFeature.values_.measureMent;
        const alreadyMeasuredTooltip = new Overlay({
          id: myFeature.id_,
          element: alreadyMeasuredElement,
          offset: [10, 900],
          position: myFeature.values_.tooltipCoord,
          positioning: 'bottom-center'
        });
        map.addOverlay(alreadyMeasuredTooltip);
      }
    }
    source.addFeatures(realFeatures);
  }

  // get fill and line color
  // Create source and layer for user location and drawings
  const layer = new VectorLayer({
    source,
    style: new Style({
      stroke: new Stroke({
        width: 3
      })
    })
  });
  map.addLayer(layer);

  /* Sets a listener on '#line-color-palette' and map click event in order to
     change the line color of either a LineString or Polygon. After changing
     the color, it returns the specified color as 'lineColor'
  */
  // eslint-disable-next-line prefer-const
  let lineColor = 'black';
  setLineColor(map, lineColor);

  // Same as above but for fill of Polygons
  let fillColor;
  setFillColor(map, fillColor);

  // Adding controls to the map
  // Selects which layer to display
  map.addControl(selectMap);
  // map.addControl(drawType);
  // map.addControl(whatKindOfHand);

  const markerTypes = ['custom-marker'];

  /* ======================================================
   * Creates marker based on marker clicked in marker-drawer
   * and waits for user to click a location in the map before
   * adding it to the map. (marker.js line 63)
   * ========================================================
   */
  moveToMap(map, markerTypes, source);

  /*
   * ==========================================
   * ==========SHOWS MARKER POPUP ON CLICK=====
   * ==========================================
   */
  map.on('click', (evt) => {
    // console.log(map.getOverlays());
    map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
      let showPopUp;
      // console.log(map.getOverlays());
      const overLays = map.getOverlays();
      const popUpArray = overLays.array_;
      if (feature) {
        // console.log(feature);
        for (let i = 0; i < markerTypes.length; i += 1) {
          // eslint-disable-next-line no-underscore-dangle
          if (feature.values_.type === markerTypes[i].split('-marker')[0]) {
            for (let j = 0; j < popUpArray.length; j += 1) {
              if (feature.id_ === popUpArray[j].id) {
                showPopUp = popUpArray[j].show(
                  feature.values_.geometry.flatCoordinates,
                  popUpArray[j].content.innerHTML
                );
              }
            }
          }
        }
      }
      return showPopUp;
    });
  });

  /*
 ============================
 CHANGES THE SELECTED LAYER
 ===========================
 */
  const select = document.getElementById('layer-select');
  const onChange = () => {
    const scheme = select.value;
    for (let i = 0, ii = layers.length; i < ii; ++i) {
      layers[i].setVisible(hereLayers[i].scheme === scheme);
    }
  };

  onChange();

  $('#layer-select').on('change', () => {
    const scheme = select.value;
    for (let i = 0, ii = layers.length; i < ii; ++i) {
      layers[i].setVisible(hereLayers[i].scheme === scheme);
    }
  });

  /*
   * ==============================
   * ======GEOCODER with POPUP=====
   * ==============================
   */

  const geocoder = new Geocoder('nominatim', {
    provider: 'osm',
    lang: 'en',
    targetType: 'glass-button',
    placeholder: 'Search for ...',
    limit: 8,
    autoComplete: true,
    keepOpen: true
  });
  map.addControl(geocoder);
  
  geocoder.on('addresschosen', (evt) => {
    // Popup showing position the user clicked
    const popup = PoPUp('popup', 'geocoderPop');
    map.addOverlay(popup);
    window.setTimeout(() => {
      popup.show(evt.coordinate, evt.address.formatted);
    }, 500);
  });

  // ================================
  // ===========GEOLOCATION==========
  // ================================
  
  navigator.geolocation.getCurrentPosition((pos) => {
    const coords = fromLonLat([pos.coords.longitude, pos.coords.latitude]);
    const userLocation = new Feature({
      geometry: new Point(coords)
    });
    userLocation.setId('userLocation');
    const locationStyle = new Style({
      image: new Icon({
        src: '/images/icons/person_pin_circle_48px.png'
      })
    });
    userLocation.setStyle(locationStyle);
    source.addFeature(userLocation);
  });

  /*
  ===================================================================
  Add Drag and Drop functionality => User can drag and drop GeoJSON data
 into map and it will display over the currently rendered map in
 the dynamic styling below.
 =====================================================================
 */
  map.addInteraction(
    new DragAndDrop({
      source,
      formatConstructors: [GeoJSON]
    })
  );

  /*
   * ==============================
   * ======CHANGES EDIT FEATURES===
   * ===from editFeatures.js=======
   * ==============================
   */
  moveModifyErase(map, source);

  // Keeps map where user left off in page reload
  sync(map);

  /*
  ===============================================
  ===============DRAWING FUNCTIONS ==============
  ===============================================
 */

  // Tooltips and Draw element
  // let sketch;
  // let helpTooltipElement = document.getElementById('help-tool-tip');
  // let helpTooltip;
  // let measureTooltipElement = document.getElementById('measure-tool-tip');
  // let measureTooltip;
  //
  // // Adds Ability to Draw on Map in Free hand mode based on the selected type
  // let draw;
  // let snap;
  // const typeSelect = document.getElementById('type');
  // const freeOrNah = document.getElementById('free-or-nah');

  /**
   * Format length output.
   * @param {module:ol/geom/LineString~LineString} line The line.
   * @return {string} The formatted length.
   */

  // const formatLength = (line) => {
  //   const length = getLength(line);
  //   let output;
  //   if (length > 804.672) {
  //     output = `${Math.round((length / 1609.344) * 100) / 100} mi`;
  //   } else {
  //     output = `${Math.round(length * 3.281)} ft`;
  //   }
  //   // console.log(output);
  //   return output;
  // };

  /**
   * Format area output.
   * @param {module:ol/geom/Polygon~Polygon} polygon The polygon.
   * @return {string} Formatted area.
   */
  // const formatArea = (polygon) => {
  //   const area = getArea(polygon);
  //   let output;
  //   if (area > 10000) {
  //     const kmSquared = Math.round((area / 1000000) * 100) / 100;
  //     output = `${Math.round(kmSquared * 247.105)} acres`;
  //   } else {
  //     const mSquared = Math.round(area * 100) / 100;
  //     output = `${Math.round(mSquared / 4046.856)} acres`;
  //   }
  //   // console.log(output);
  //   return output;
  // };

  /** ============================
   * Creates a new help tooltip
   * =============================
   * */
  // const createHelpTooltip = () => {
  //   if (helpTooltipElement) {
  //     helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  //   }
  //   helpTooltipElement = document.createElement('div');
  //   helpTooltipElement.className = 'tooltip hidden';
  //   helpTooltip = new Overlay({
  //     element: helpTooltipElement,
  //     offset: [15, 20],
  //     positioning: 'center-left'
  //   });
  //   map.addOverlay(helpTooltip);
  // };

  /** ============================
   * Creates a new measure tooltip
   * =============================
   * */

  // const createMeasureTooltip = () => {
  //   if (measureTooltipElement) {
  //     measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  //   }
  //   measureTooltipElement = document.createElement('div');
  //   measureTooltipElement.className = 'tooltip tooltip-measure';
  //   measureTooltip = new Overlay({
  //     element: measureTooltipElement,
  //     offset: [10, 900],
  //     positioning: 'bottom-center'
  //   });
  //   map.addOverlay(measureTooltip);
  // };

  // ============================
  // ====Adds drawing to map=====
  // ============================

  // const addDrawInteraction = () => {
  //   const type = typeSelect.value;
  //   // console.log(type);
  //   const freehands = freeOrNah.value === 'freehand';
  //
  //   if (type !== 'None') {
  //     createHelpTooltip();
  //     helpTooltipElement.classList.remove('hidden');
  //     draw = new Draw({
  //       source,
  //       type,
  //       freehand: freehands,
  //       style: new Style({
  //         fill: new Fill({
  //           color: 'rgba(255, 255, 255, 0.4)'
  //         }),
  //         stroke: new Stroke({
  //           color: 'rgba(0, 0, 0, 1)',
  //           lineDash: [10, 10],
  //           width: 4
  //         }),
  //         image: new CircleStyle({
  //           radius: 7,
  //           stroke: new Stroke({
  //             color: 'rgba(0, 0, 0, 1)'
  //           }),
  //           fill: new Fill({
  //             color: 'rgba(255, 255, 255, 0.7)'
  //           })
  //         })
  //       })
  //     });
  //     map.addInteraction(draw);
  //     snap = new Snap({ source });
  //     map.addInteraction(snap);
  //
  //     createMeasureTooltip();
  //
  //     let listener;
  //     let drawnFeatureId;
  //     draw.on(
  //       'drawstart',
  //       (evt) => {
  //         helpTooltipElement.classList.add('hidden');
  //         measureTooltipElement.classList.remove('hidden');
  //         drawnFeatureId = uniqid.process();
  //         // set sketch
  //         sketch = evt.feature;
  //         console.log(sketch);
  //         sketch.setId(drawnFeatureId);
  //         sketch.values_.id = drawnFeatureId;
  //
  //         let tooltipCoord = evt.coordinate;
  //
  //         listener = sketch.getGeometry().on('change', (evt) => {
  //           const geom = evt.target;
  //           let output;
  //           if (geom instanceof Polygon) {
  //             output = formatArea(geom);
  //             tooltipCoord = geom.getInteriorPoint().getCoordinates();
  //             sketch.values_.measureMent = output;
  //             sketch.values_.tooltipCoord = tooltipCoord;
  //           } else if (geom instanceof LineString) {
  //             output = formatLength(geom);
  //             tooltipCoord = geom.getLastCoordinate();
  //             sketch.values_.measureMent = output;
  //             sketch.values_.tooltipCoord = tooltipCoord;
  //           }
  //           measureTooltipElement.innerHTML = output;
  //           measureTooltip.setPosition(tooltipCoord);
  //         });
  //       },
  //       this
  //     );
  //
  //     draw.on(
  //       'drawend',
  //       () => {
  //         measureTooltipElement.className = 'tooltip tooltip-static';
  //         measureTooltip.setOffset([10, 900]);
  //         measureTooltip.id = drawnFeatureId;
  //         measureTooltip.values_.id = drawnFeatureId;
  //         // unset sketch
  //         sketch = null;
  //         // unset tooltip so that a new one can be created
  //         measureTooltipElement = null;
  //         createMeasureTooltip();
  //         unByKey(listener);
  //       },
  //       this
  //     );
  //   }
  // };
  // // Handles the change in draw type i.e. polygon, line, or none
  // typeSelect.onchange = () => {
  //   map.removeInteraction(draw);
  //   map.removeInteraction(snap);
  //   addDrawInteraction();
  // };
  //
  // freeOrNah.onchange = () => {
  //   map.removeInteraction(draw);
  //   map.removeInteraction(snap);
  //   addDrawInteraction();
  // };
  //
  // addDrawInteraction();

  /** =================================================================
   * Adds Tool Tips for Draw Feature.
   * @param {module:ol/MapBrowserEvent~MapBrowserEvent} evt The event.
   * ==================================================================
   * */
  // const pointerMoveHandler = (evt) => {
  //   if (evt.dragging) {
  //     return;
  //   }
  //   if (typeSelect.value !== 'None') {
  //     /** @type {string} */
  //     let helpMsg = 'Click to start drawing';
  //     if (sketch) {
  //       const geom = sketch.getGeometry();
  //       if (geom instanceof Polygon) {
  //         helpMsg = 'Click to continue drawing the polygon';
  //       } else if (geom instanceof LineString) {
  //         helpMsg = 'Click to continue drawing the line';
  //       }
  //     }
  //     helpTooltipElement.innerHTML = helpMsg;
  //     helpTooltipElement.classList.remove('hidden');
  //     helpTooltip.setPosition(evt.coordinate);
  //   } else {
  //     helpTooltipElement.classList.add('hidden');
  //   }
  // };
  //
  // map.on('pointermove', pointerMoveHandler);
  //
  // map.getViewport().addEventListener('mouseout', () => {
  //   helpTooltipElement.classList.add('hidden');
  //   helpTooltipElement.innerHTML = '';
  // });

  const mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: 'EPSG:4326',
    undefinedHTML: ''
  });
  map.addControl(mousePositionControl);

  /*
  =============================
  Clears all features from map
  =============================
   */
  // $('#clear').click(() => {
  //   const overLaysCollection = map.getOverlays();
  //   overLaysCollection.clear();
  //   source.clear();
  // });

  /*
  ==========================================
  Saves the map when a new feature is added
  =========================================
  */
  // source.on('addfeature', () => {
  //   const center = map.getView().getCenter();
  //   const features = source.getFeatures();
  //   const jsonFeatures = format.writeFeatures(features);
  //   return saveMap(center, jsonFeatures);
  // });

  /*
   ==========================================
   Saves the map when a new feature is changed
   =========================================
   */
  // source.on('changefeature', () => {
  //   const center = map.getView().getCenter();
  //   const features = source.getFeatures();
  //   const jsonFeatures = format.writeFeatures(features);
  //   return saveMap(center, jsonFeatures);
  // });

  /*
   ============================================
   Saves the map when 'save' button is clicked
   ============================================
   */
  // $('#save').click(() => {
  //   const center = map.getView().getCenter();
  //   const features = source.getFeatures();
  //   const jsonFeatures = format.writeFeatures(features);
  //   return saveMap(center, jsonFeatures);
  // });
});
