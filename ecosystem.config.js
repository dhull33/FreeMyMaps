/* ======================================
 * So PM2 will work with Heroku
 * ==================================
 */
module.exports = {
  apps: [
    {
      name: 'FreeMyMaps',
      script: './app.js',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
