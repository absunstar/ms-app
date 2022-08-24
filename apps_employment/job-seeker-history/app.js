module.exports = function init(site) {

  site.get({
    name: 'JobSeekerHistory',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });



};
