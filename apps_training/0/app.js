module.exports = function init(site){

  site.get({
      name : '/',
      path : __dirname + '/site_files'
  })

  site.post({
    name: '/api/gender/all',
    path: __dirname + '/site_files/json/gender.json',
    public : true
  });
  
}