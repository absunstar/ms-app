module.exports = function init(site) {
  site.get({
    name: 'PartnersCertificates',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

};
