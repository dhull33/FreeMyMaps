/* eslint-disable consistent-return,import/prefer-default-export */
import axios from 'axios';

export const getFeaturesFromBackEnd = async () => {
  const path = window.location.pathname;
  const splitProp = path.split('/');
  // console.log(splitProp);
  if (splitProp[1] === 'hunt-clubs') {
    const clubId = splitProp[2];
    const mapId = splitProp[3];
    try {
      const response = await axios.get(`/hunt-clubs/${clubId}/render/${mapId}`);
      return response.data.huntclub;
    } catch (error) {
      console.log(error);
    }
  } else {
    const propertyName = splitProp[2];
    try {
      const response = await axios.get(`/properties/render/${propertyName}`);
      return response.data.properties;
    } catch (error) {
      console.log(error);
    }
  }
};
