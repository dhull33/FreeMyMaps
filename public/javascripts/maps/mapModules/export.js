/*
 ===================================================================
 Export and Download as png
 =====================================================================
 */

export const downloadPNG = (map, downloadElementId) => {
  const download = document.getElementById(`${downloadElementId}`);
  return download.addEventListener('click', () => {
    map.once('rendercomplete', (event) => {
      console.log(event);
      const canvas = event.context.canvas;
      canvas.setAttribute('crossOrigin', 'Anonymous');
      canvas.toBlob((blob) => {
        saveAs(blob, 'map.png');
      });
    });
    map.renderSync();
  });
};
