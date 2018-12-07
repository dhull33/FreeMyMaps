import TileLayer from 'ol/layer/Tile';
import XYZSource from 'ol/source/XYZ';

const urlTpl =
  'https://{1-4}.{base}.maps.cit.api.here.com' +
  '/{type}/2.1/maptile/newest/{scheme}/{z}/{x}/{y}/256/png' +
  '?app_id={app_id}&app_code={app_code}';

const createURL = function createUrl(tpl, layerDesc) {
  return tpl
    .replace('{base}', layerDesc.base)
    .replace('{type}', layerDesc.type)
    .replace('{scheme}', layerDesc.scheme)
    .replace('{app_id}', layerDesc.app_id)
    .replace('{app_code}', layerDesc.app_code);
};

export default (myLayers) => {
  const yourLayers = [];
  let i;
  let ii;
  for (i = 0, ii = myLayers.length - 2; i < ii; i += 1) {
    const layerDesc = myLayers[i];
    yourLayers.push(
      new TileLayer({
        visible: false,
        preload: Infinity,
        source: new XYZSource({
          url: createURL(urlTpl, layerDesc),
          attributions:
            `Map Tiles &copy; ${new Date().getFullYear()} ` +
            `<a href="http://developer.here.com">HERE</a>`
        })
      })
    );
  }
  // Topographical maps from UGS
  yourLayers.push(
    new TileLayer({
      visible: false,
      preload: Infinity,
      source: new XYZSource({
        url:
          'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
        attributions:
          `Map Tiles &copy; ${new Date().getFullYear()} ` +
          `<a href="https://viewer.nationalmap.gov/launch">The National Map</a>`
      })
    })
  );
  yourLayers.push(
    new TileLayer({
      visible: false,
      preload: Infinity,
      source: new XYZSource({
        url:
          'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}',
        attributions:
          `Map Tiles &copy; ${new Date().getFullYear()} ` +
          `<a href="https://viewer.nationalmap.gov/launch">The National Map</a>`
      })
    })
  );
  console.log('=========THESE ARE MY LAYERS=========');
  console.log(yourLayers);

  return yourLayers;
};
