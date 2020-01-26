# FreeMyMaps

[![Known Vulnerabilities](https://snyk.io//test/github/dhull33/FreeMyMaps/badge.svg?targetFile=package.json)](https://snyk.io//test/github/dhull33/FreeMyMaps?targetFile=package.json)[![dependencies Status](https://david-dm.org/dhull33/FreeMyMaps.svg)](https://david-dm.org/dhull33/FreeMyMaps)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdhull33%2FFreeMyMaps.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdhull33%2FFreeMyMaps?ref=badge_shield)

A completely free mapping application that you can use or modify for your own app! What could be better than that? I'll let you decide!

https://freemymaps.herokuapp.com/

## Current Features

1. 8 different map types

   - Topographical with Satellite (detailed view US only)
   - Topographical with contour lines (detailed view US only)
   - Normal Day
   - Normal Day Transit
   - Pedestrian Day
   - Terrain Day
   - Satellite Day
   - Hybrid Day

   ![](./public/images/topo-screen-shot.png)

   P.S. check out this fantastic example that helped me quite a bit: https://openlayers.org/en/latest/examples/here-maps.html

2. OSM Geocoder

   - Uses Open Street Map Data and [ol-geocoder](https://github.com/jonataswalker/ol-geocoder)

3. Geolocation

   - It's surprisingly easy to get someone's location. The following code is all that is needed (public/javascripts/maps/mainMap.js line 360):

     ```javascript
     navigator.geolocation.getCurrentPosition((yourPosition) => {
       // yourPosition is an object from your brower's Geolocation API
     });
     ```

   - Here's a link from [Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) that goes into more detail

4. Drawing

   - Freehand
   - Not freehand
   - Lines and Polygons ([in case you forgot what a polygon is](https://en.wikipedia.org/wiki/Polygon))

5. Accounts

   - Can create an account with a unique username

6. Download

   - As a png image
   - GeoJSON data

## Bugs

If you have encountered a bug or would like to request a feature, please use the [GitHub issue tracker](https://github.com/dhull33/FreeMyMaps/issues).
