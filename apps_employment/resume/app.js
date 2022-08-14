module.exports = function init(site) {
  // const $resume = site.connectCollection("resume")

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/'
  })

  site.get({
    name: "Resume",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })

 

}