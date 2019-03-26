/*
 ===================================================================
 Export and Download as png
 =====================================================================
 */
import saveAs from 'file-saver';

export default (map, downloadElementId) => {
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
