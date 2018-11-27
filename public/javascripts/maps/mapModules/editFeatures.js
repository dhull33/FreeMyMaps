/* eslint-disable no-underscore-dangle */
import Translate from 'ol/interaction/Translate';
import Modify from 'ol/interaction/Modify';
import { unByKey } from 'ol/Observable';

export default (map, source) => {
  const moveFeatures = new Translate();
  const modifyFeatures = new Modify({
    source
  });
  let listenForErase;
  // eslint-disable-next-line consistent-return
  return $('#edit-list').on('click', (evt) => {
    if (evt.target.id === 'modify') {
      map.removeInteraction(moveFeatures);
      unByKey(listenForErase);
      map.addInteraction(modifyFeatures);
    } else if (evt.target.id === 'move') {
      map.removeInteraction(modifyFeatures);
      unByKey(listenForErase);
      map.addInteraction(moveFeatures);
    } else if (evt.target.id === 'eraser') {
      map.removeInteraction(modifyFeatures);
      map.removeInteraction(moveFeatures);
      listenForErase = map.on('dblclick', (e) => {
        // console.log(map.getOverlays());
        map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
          // console.log(e);
          if (feature) {
            // console.log(feature);
            // console.log(layer);
            // console.log(feature.values_.type);
            const overLays = map.getOverlays();
            const popUpArray = overLays.array_;
            for (let j = 0; j < popUpArray.length; j += 1) {
              if (feature.id_ === popUpArray[j].id) {
                map.removeOverlay(popUpArray[j]);
              }
            }
            source.removeFeature(feature);
          }
        });
      });
    } else if (evt.target.id === 'none') {
      unByKey(listenForErase);
      map.removeInteraction(modifyFeatures);
      map.removeInteraction(moveFeatures);
    }
  });
};
