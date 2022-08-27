module.exports = function init(site) {

  site.get({
    name: 'EmployerSearch',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
    public : true
  });



};
