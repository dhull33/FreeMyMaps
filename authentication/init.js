const passport = require('passport');
const db = require('../../the-hunter-sight/data/database-main');

module.exports = () => {
  passport.serializeUser((user, done) => {
    return done(null, user);
  });

  passport.deserializeUser((user, done) => {
    console.log('De-Serializing User');

    return db
      .tx(async (t) => {
        const user2 = await t.any('SELECT * FROM users WHERE user_id=$1', [user.user_id]);
        const properties = await t.any(
          'SELECT * FROM properties WHERE user_id=$1 AND active = true ORDER BY title',
          [user.user_id]
        );
        user2[0].properties = properties;

        const huntClubs = await t.any('SELECT * FROM hunt_club_memb WHERE user_id=$1', [
          user.user_id
        ]);
        let huntClubSQL = "hunt_club_id = 'Fake' OR"; // Placed equal to fake to prevent a customer who is not in any hunt clubs from receiving an error
        for (let i = 0; i < huntClubs.length; i++) {
          huntClubSQL = `${huntClubSQL} hunt_club_id = '${huntClubs[i].hunt_club_id}' OR`;
        }
        huntClubSQL = huntClubSQL.replace(/or$/i, '');

        const huntClubList = await t.any(
          `SELECT * FROM hunt_club WHERE ${huntClubSQL} ORDER BY name`
        );
        user2[0].hunt_clubs = huntClubList;

        const foodPlot = await t.any(
          'SELECT food_plot.*, properties.title FROM food_plot INNER JOIN properties ON food_plot.property_id = properties.property_id WHERE food_plot.user_id=$1 ORDER BY properties.title, food_plot.date_planted',
          [user.user_id]
        );
        const supplementation = await t.any(
          'SELECT supplementation.*, properties.title FROM supplementation INNER JOIN properties ON supplementation.property_id = properties.property_id WHERE supplementation.user_id=$1 ORDER BY properties.title, supplementation.date_applied',
          [user.user_id]
        );
        const mineralBlock = await t.any(
          'SELECT mineral_block.*, properties.title FROM mineral_block INNER JOIN properties ON mineral_block.property_id = properties.property_id WHERE mineral_block.user_id=$1 ORDER BY properties.title, mineral_block.date_applied',
          [user.user_id]
        );
        user2[0].nutrition = {
          foodPlot,
          supplementation,
          mineralBlock
        };
        const today = new Date();
        let weekAgo = new Date();
        weekAgo = new Date(weekAgo.setDate(weekAgo.getDate() - 7));

        const leaseListings = await t.any(
          'SELECT users.first_name, users.last_name, lease_listings.* FROM lease_listings INNER JOIN users ON lease_listings.user_id = users.user_id WHERE lease_listings.date_posted BETWEEN $1 AND $2',
          [weekAgo, today]
        );
        user2[0].leaseListings = leaseListings;

        const harvestData = await t.any(
          'SELECT properties.title, harvest.* FROM harvest INNER JOIN properties ON harvest.property_id = properties.property_id WHERE harvest.user_id = $1 ORDER BY properties.title, harvest.harvest_date',
          [user.user_id]
        );
        user2[0].harvest = harvestData;

        const photoData = await t.any(
          'SELECT photos.*, photo_folders.folder_name, photo_folders.last_modified FROM photos INNER JOIN photo_folders ON photos.folder_id = photo_folders.folder_id WHERE photos.user_id = $1',
          [user.user_id]
        );
        user2[0].photos = photoData;

        const photoFolders = await t.any(
          'SELECT * FROM photo_folders WHERE photo_folders.user_id = $1 AND photo_folders.status = $2 ORDER BY folder_name',
          [user.user_id, 'Active']
        );
        user2[0].photoFolders = photoFolders;

        const cameras = await t.any(
          'SELECT * FROM cameras WHERE cameras.user_id = $1 AND cameras.status = $2 ORDER BY camera_name',
          [user.user_id, 'Active']
        );
        user2[0].cameras = cameras;

        const sharedPhotos = await t.any(
          `SELECT hunt_club_memb.user_id, hunt_club_memb.hunt_club_id, hunt_club.name as hunt_club_name, users.profile_picture,shared_photos.full_name, shared_photos.photo_link, shared_photos.shared_photo_date
        FROM hunt_club_memb
        INNER JOIN shared_photos ON shared_photos.hunt_club_id = hunt_club_memb.hunt_club_id
        INNER JOIN hunt_club ON hunt_club.hunt_club_id = hunt_club_memb.hunt_club_id
        INNER JOIN users ON shared_photos.user_id = users.user_id
        WHERE hunt_club_memb.user_id = $1
        ORDER BY shared_photos.shared_photo_date desc`,
          [user.user_id]
        );
        user2[0].sharedPhotos = sharedPhotos;

        return done(null, user2[0]);
      })
      .catch((error) => {
        console.log('===========THERE WAS AN ERROR WITH DESERIALIZE USER=============');
        console.log(error);
        return done(null, false, {
          message: 'There was an error. Please sign in again.'
        });
      });
  });
};
