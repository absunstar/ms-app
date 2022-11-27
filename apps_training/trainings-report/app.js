module.exports = function init(site) {

  site.get({
    name: 'TrainingsReports',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

};
