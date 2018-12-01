const express = require('express');
const db = require('../../data/database-main');

const app = express();
// TODO: Use this for user's maps
// app.param('property', (req, res, next, propertyID) => {
//   if (req.user) {
//     const sanitizedPropId = propertyID.substring(0, 36);
//     console.log(sanitizedPropId);
//     return db
//       .any('SELECT * FROM maps WHERE property_id=$1 AND user_id=$2 AND active = true', [
//         sanitizedPropId,
//         req.user.user_id
//       ])
//       .then((property) => {
//         // console.log(property);
//         // eslint-disable-next-line prefer-destructuring
//         req.property = property[0];
//         return next();
//       })
//       .catch((error) => {
//         console.log(error);
//         return next(error);
//       });
//   }
//   return res.redirect('/login');
// });

app.get('/maps/:property', (req, res) => {
  let firstName;
  if (req.user) {
    firstName = req.user.first_name;
  }
  // console.log(req.property);
  return res.render('property', {
    title: `${req.property.title} – The Hunter Sight`,
    name: firstName,
    properties: req.user.properties,
    huntClubs: req.user.hunt_clubs
  });
});

app.post('/save/:property/map', (req, res, next) => {
  console.log('==========SAVED MAP==========');
  const { propertyId, propertyCenter, features } = req.body;
  const sanitizedPropId = propertyId.substring(0, 36);
  return db
    .none(
      'UPDATE maps SET map_features=$1, map_center=$2 WHERE' +
        ' property_id=$3 AND user_id=$4',
      [features, propertyCenter, sanitizedPropId, req.user.user_id]
    )
    .then(() => {
      return res.send({
        status: 'Saved!'
      });
    })
    .catch((error) => {
      console.log(error);
      return next(error);
    });
});

app.post('/save/property/marker', (req, res, next) => {
  return res.send({
    status: 'Saved!'
  });
});

app.get('/maps/render/:property', (req, res, next) => {
  return res.send({ properties: req.property });
});

module.exports = app;
