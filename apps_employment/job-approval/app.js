module.exports = function init(site) {

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
  });

  site.get({
    name: 'JobApproval',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

};
