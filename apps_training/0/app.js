module.exports = function init(site){

  site.get({
      name : '/',
      path : __dirname + '/site_files'
  })
}