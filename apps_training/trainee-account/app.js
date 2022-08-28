module.exports = function init(site) {
  site.get({
    name: 'TraineeAccount',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });
};
