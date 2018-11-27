/* eslint-disable no-underscore-dangle,no-param-reassign,no-undef */
import PopUp from 'ol-popup';
import GeoJSON from 'ol/format/GeoJSON';
import axios from 'axios';

export const PoPUp = (elementID, id) => {
  return new PopUp({
    id,
    element: document.getElementById(elementID),
    autoPan: true,
    positioning: 'top-center',
    className: 'popup reveal',
    offset: [4, -20],
    insertFirst: false
  });
};

export const submitPopUpForm = (marker, popup, format, source, coords) => {
  return popup.getElement().addEventListener('click', (e) => {
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
      const path = window.location.pathname;
      const propertyId = path.split('/')[2];
      // console.log(path.split('/'));
      const features = source.getFeatures();
      const jsonFeatures = format.writeFeatures(features);
      axios
        .post(`/save/${propertyId}/map`, {
          propertyId,
          propertyCenter: coords,
          features: jsonFeatures
        })
        .then((response) => {
          // console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    e.preventDefault();
  });
};
