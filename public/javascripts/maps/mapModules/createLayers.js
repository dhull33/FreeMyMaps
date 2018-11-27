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

export default (hereLayers) => {
  const layers = [];
  let i;
  let ii;

  // eslint-disable-next-line no-plusplus
  for (i = 0, ii = hereLayers.length - 2; i < ii; ++i) {
    const layerDesc = hereLayers[i];
    layers.push(
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
  // This is the topographical layer from UGS
  layers.push(
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

  layers.push(
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

  return layers;
};
