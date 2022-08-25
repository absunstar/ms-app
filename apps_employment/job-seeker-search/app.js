module.exports = function init(site) {

  site.get({
    name: 'JobSeekerSearch',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });



};
