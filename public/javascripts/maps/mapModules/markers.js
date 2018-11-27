/* eslint-disable no-undef,no-underscore-dangle */
import Feature from 'ol/Feature';
import { Icon, Style } from 'ol/style';
import Point from 'ol/geom/Point';
import uniqid from 'uniqid';
import axios from 'axios';
import GeoJSON from 'ol/format/GeoJSON';
import { PoPUp } from './popUp';
// eslint-disable-next-line import/prefer-default-export

export const getCoordinates = (mousePositionControl) => {
  const rawCoords = mousePositionControl.element.innerText;
  const coords = rawCoords.split(',');
  return coords;
};

export const createMarkerFeature = (coords, type) => {
  const path = `/images/map-markers/${type}.png`;
  const id = uniqid.time();
  const markerFeature = new Feature({
    geometry: new Point(coords),
    type,
    path,
    id,
    name: '',
    notes: ''
  });
  markerFeature.setId(id);
  const styleIcon = new Style({
    image: new Icon({
      src: `/images/map-markers/${type}.png`
    })
  });
  markerFeature.setStyle(styleIcon);

  return markerFeature;
};

export const moveToMap = (map, markerTypes, source) => {
  // eslint-disable-next-line consistent-return,no-undef
  return $('#marker-drawer').on('click', (evt) => {
    // console.log(evt);
    // console.log(evt.originalEvent.path);
    const eventPath = evt.originalEvent.path;
    for (let i = 0; i < eventPath.length; i += 1) {
      for (let j = 0; j < markerTypes.length + 1; j += 1) {
        if (eventPath[i].id === markerTypes[j]) {
          const markerType = markerTypes[j].split('-marker');
          const type = markerType[0];
          // eslint-disable-next-line no-loop-func
          const setMarker = map.once('singleclick', (event) => {
            // create the pop-up when marker is placed on map
            let iconColor = 'black';
            if (type === 'feeder') {
              iconColor = '#FF7900';
            } else if (type === 'sighting') {
              iconColor = '#FF0000';
            } else if (type === 'game-camera') {
              iconColor = '#BDCCD4';
            } else if (type === 'food-plot') {
              iconColor = '#8CC63F';
            } else if (type === 'campsite') {
              iconColor = '#B79676';
            } else if (type === 'box-blind') {
              iconColor = '#A67C52';
            } else if (type === 'oak-fruit') {
              iconColor = '#009245';
            } else if (type === 'water') {
              iconColor = '#29ABE2';
            } else if (type === 'minerals') {
              iconColor = '#496DA5';
            } else if (type === 'treestand') {
              iconColor = '#5E3118';
            } else if (type === 'ground-blind') {
              iconColor = '#875730';
            } else if (type === '4-wheeler') {
              iconColor = '#FBB03B';
            } else if (type === 'scrape') {
              iconColor = '#8F3DF9';
            } else if (type === 'tree-rub') {
              iconColor = '#BAB03B';
            } else if (type === 'custom') {
              iconColor = '#F2F2F2';
            }

            const coords = event.coordinate;
            const marker = createMarkerFeature(coords, type);
            // console.log(marker);
            source.addFeature(marker);
            const popUp = PoPUp('map-marker-popup', marker.values_.id);
            map.addOverlay(popUp);
            marker.values_.iconColor = iconColor;
            marker.values_.markerTitle = type.charAt(0).toUpperCase() + type.slice(1);
            marker.values_.popUpIcon = `/images/map-marker-icons/${type}.svg`;

            window.setTimeout(() => {
              popUp.show(
                coords,
                `<div class="popup-wrapper">\n
                    <div class="popup-body">
                      <span class="marker-type" style="color: ${marker.values_.iconColor}">
                        <embed type="image/svg+xml" src="${marker.values_.popUpIcon}"/>
                        ${marker.values_.markerTitle}
                      </span>
                      <form id="pop-up-form" class="popup-form">
                        <input id="marker-name-${marker.values_.id}" data-name="markName" 
                        placeholder="Marker Name (Required)" value="">
                        <textarea id="marker-notes-${
                          marker.values_.id
                        }" data-notes="markNotes" placeholder="Notes (Optional)"></textarea>
                        <span class="button-wrapper">
                          <button id="markerButton" data-submit="true" type="submit">
                            <i class="fas fa-plus"></i>
                            Add to Property
                          </button>
                        </span>
                      </form>
                     </div>
                    </div>`
              );
            }, 500);
            // 'markerButton');

            return popUp.getElement().addEventListener('click', (e) => {
              const submitMe = e.target.getAttribute('data-submit');
              const markName = $(`#marker-name-${marker.values_.id}`).val();
              const markNotes = $(`#marker-notes-${marker.values_.id}`).val();
              if (submitMe) {
                // console.log(this);
                $(`#marker-name-${marker.values_.id}`).attr('value', markName);
                $(`#marker-notes-${marker.values_.id}`).text(markNotes);
                marker.values_.name = markName;
                marker.values_.notes = markNotes;
                // Save map after filling out marker info
                const format = new GeoJSON();
                const center = map.getView().getCenter();
                const path = window.location.pathname;
                const propertyId = path.split('/')[2];
                const features = source.getFeatures();
                const jsonFeatures = format.writeFeatures(features);
                axios
                  .post(`/save/${propertyId}/map`, {
                    propertyId,
                    propertyCenter: center,
                    features: jsonFeatures
                  })
                  .then((response) => {
                    console.log(response);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
              e.preventDefault();
            });
          });
          return setMarker;
        }
      }
    }
  });
};
