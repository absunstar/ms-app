module.exports = function init(site) {

  site.get({
    name: 'TrainingCentersCertificates',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

};
