/*
 ===================================================================
 Export and Download as png
 =====================================================================
 */
import saveAs from 'file-saver';
import { GeoJSON } from 'ol/format';

export const downloadPNG = (map, downloadElementId) => {
  const download = document.getElementById(`${downloadElementId}`);
  return download.addEventListener('click', () => {
    map.once('rendercomplete', (event) => {
      const { canvas } = event.context;
      canvas.toBlob((blob) => {
        saveAs(blob, 'map.png');
      });
    });
    map.renderSync();
  });
};

export const downloadGEO = (source, downloadElementId) => {
  const format = new GeoJSON({ featureProjection: 'EPSG: 3857' });
  const download = document.getElementById(`${downloadElementId}`);
  source.on('change', () => {
    const features = source.getFeatures();
    const json = format.writeFeatures(features);
    download.href = `data:text/json;charset=utf-8 ${json}`;
  });
};
